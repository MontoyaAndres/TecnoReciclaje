import { getConnection } from "typeorm";

import { ResolveMap } from "../../../../types/graphql-utils";
import { GQL } from "../../../../types/schema";
import { User } from "../../../../entity/User";
import { Business } from "../../../../entity/Business";
import { FeedBack } from "../../../../entity/FeedBack";
import { createMiddleware } from "../../../../utils/createMiddleware";
import { middleware } from "../../../shared/authMiddleware";
import { sendFeedbackEmail } from "../../../../utils/sendEmail";

export const resolvers: ResolveMap = {
  Feedback: {
    from: async ({ fromId }) => {
      const user = await User.findOne({
        where: { id: fromId }
      });
      const business = await Business.findOne({
        where: { id: fromId }
      });

      if (user) {
        return {
          type: "User",
          ...user
        };
      }

      if (business) {
        return {
          type: "Business",
          ...business
        };
      }

      return null;
    }
  },
  Query: {
    feedback: async (_, { id, limit }: GQL.IFeedbackOnQueryArguments) => {
      const response = await FeedBack.find({
        where: { toId: id },
        order: { createdAt: "DESC" },
        skip: limit,
        take: 10
      });

      const { count } = await getConnection()
        .getRepository(FeedBack)
        .createQueryBuilder("feedback")
        .select("SUM(feedback.stars)", "count")
        .where("feedback.toId = :id", { id })
        .getRawOne();

      return {
        response,
        count
      };
    }
  },
  Mutation: {
    feedback: createMiddleware(
      middleware.auth,
      async (
        _,
        { toId, stars, comment, type }: GQL.IFeedbackOnMutationArguments,
        { session }
      ) => {
        const user = await User.findOne({
          where: { id: session.userId },
          select: ["id", "name"]
        });
        const business = await Business.findOne({
          where: { id: session.userId },
          select: ["id", "name"]
        });

        // Who is logged in, an user or a business
        const accountId = user ? user.id : business.id;

        if (accountId) {
          const alreadyCommented = await FeedBack.findOne({
            where: { fromId: accountId, toId }
          });

          if (alreadyCommented) {
            return [
              {
                path: "comment",
                message: "No puede comentar más de una vez."
              }
            ];
          }
        }

        if (toId === session.userId) {
          return [
            {
              path: "stars",
              message: "No permitido."
            }
          ];
        }

        if (stars < 0) {
          return [
            {
              path: "stars",
              message: "Es necesario como minimo 1 estrasella."
            }
          ];
        }

        if (stars > 5) {
          return [
            {
              path: "stars",
              message: "No puede añadir más de 5 estrellas."
            }
          ];
        }

        await FeedBack.create({
          toId,
          fromId: session.userId,
          feedbackType: type, // This value is important, because with this you can identify if the feedback is by an user or business
          stars,
          comment
        }).save();

        // Getting email from toId
        const toUser = await User.findOne({
          where: { id: toId },
          select: ["email"]
        });
        const toBusiness = await Business.findOne({
          where: { id: toId },
          select: ["email"]
        });

        sendFeedbackEmail(
          toUser ? toUser.email : toBusiness.email,
          user ? user.name : business.name,
          comment
        );

        return null;
      }
    ),
    deleteFeedback: createMiddleware(
      middleware.auth,
      async (_, { id }: GQL.IDeleteFeedbackOnMutationArguments) => {
        await FeedBack.delete({ id });
        return true;
      }
    )
  }
};
