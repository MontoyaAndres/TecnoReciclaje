import gql from "graphql-tag";

const informationQuery = gql`
  query InformationQuery($id: ID!) {
    information(id: $id) {
      routePhoto
      routeCover
      name
      lastname
      description
      identificationDocumentType
      identificationDocument
      address
      telephone
      departament
      town
      nationality
      birth
      civilStatus
      linkedin
      skype
      website
      gender
      email
      skills
      language {
        id
        language
        level
      }
      study {
        id
        place
        level
        area
        startedOn
        finishIn
      }
      work {
        id
        company
        departament
        sector
        job
        area
        goals
        startedOn
        finishIn
      }
      cv {
        id
        routeCV
        filename
      }
    }
  }
`;

const feedbackQuery = gql`
  query FeedbackQuery($id: ID!, $type: String!) {
    feedback(id: $id, type: $type) {
      id
      stars
      comment
      from {
        id
        name
        lastname
        routePhoto
      }
    }
  }
`;

const countFeedbackStarsQuery = gql`
  query CountFeedbackStarsQuery($id: ID!, $type: String!) {
    countFeedbackStars(id: $id, type: $type)
  }
`;

const necessityQuery = gql`
  query NecessityQuery($userId: ID!) {
    necessity(userId: $userId) {
      id
      finished
      comment
    }
  }
`;

const countNecessityQuery = gql`
  query CountNecessityQuery($userId: ID!) {
    countNecessity(userId: $userId)
  }
`;

const portfolioQuery = gql`
  query PortfolioQuery($id: ID!, $type: String!) {
    portfolio(id: $id, type: $type) {
      id
      multimedia
      description
    }
  }
`;

export {
  informationQuery,
  feedbackQuery,
  countFeedbackStarsQuery,
  necessityQuery,
  countNecessityQuery,
  portfolioQuery
};
