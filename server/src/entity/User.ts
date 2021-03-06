import * as bcrypt from "bcryptjs";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
  Index
} from "typeorm";

// Models
import { Necessity } from "./Necessity";
import { Study } from "./Study";
import { Work } from "./Work";
import { CV } from "./CV";
import { Language } from "./Language";
import { PreferWork } from "./PreferWork";
import EmptyStringToNull from "../utils/emptyStringToNull";
import { Business } from "./Business";

enum ENUMIdentificationDocumentType {
  A1 = "CÉDULA DE CIUDADANÍA",
  A2 = "CÉDULA DE EXTRANJERÍA",
  A3 = "TARJETA DE IDENTIDAD",
  A4 = "PASAPORTE",
  A5 = "NÚMERO DE IDENTIFICACIÓN"
}

enum ENUMCivilStatus {
  A1 = "SOLTERO(A)",
  A2 = "CASADO(A)",
  A3 = "SEPARADO(A)/DIVORCIADO(A)",
  A4 = "VIUDO(A)"
}

enum ENUMGender {
  A1 = "HOMBRE",
  A2 = "MUJER"
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", {
    default:
      "https://res.cloudinary.com/te-vi-colombia/image/upload/v1557617381/default/default-photo_uza4gy.png" // default image from cloudinary
  })
  routePhoto: string;

  @Column("varchar", {
    nullable: true,
    transformer: new EmptyStringToNull()
  })
  cloudinaryPublicIdRoutePhoto: string;

  @Column("varchar", { nullable: true, transformer: new EmptyStringToNull() })
  routeCover: string;

  @Column("varchar", {
    nullable: true,
    transformer: new EmptyStringToNull()
  })
  cloudinaryPublicIdRouteCover: string;

  @Index({ fulltext: true })
  @Column("varchar")
  name: string;

  @Index({ fulltext: true })
  @Column("varchar")
  lastname: string;

  @Index({ fulltext: true })
  @Column("varchar", {
    length: 100,
    nullable: true,
    transformer: new EmptyStringToNull()
  })
  description: string;

  @Column("enum", { enum: ENUMIdentificationDocumentType })
  identificationDocumentType: string;

  @Column("bigint", { unique: true })
  identificationDocument: number;

  @Column("varchar", { nullable: true, transformer: new EmptyStringToNull() })
  address: string;

  @Column("integer")
  telephoneCountry: number;

  @Column("bigint", { unique: true })
  telephone: number;

  @Column("integer", { nullable: true, transformer: new EmptyStringToNull() })
  telephone2Country: number;

  @Column("bigint", {
    nullable: true,
    transformer: new EmptyStringToNull()
  })
  telephone2: number;

  @Column("varchar", {
    nullable: true,
    transformer: new EmptyStringToNull()
  })
  departament: string;

  @Column("varchar", { nullable: true, transformer: new EmptyStringToNull() })
  town: string;

  @Column("varchar", {
    nullable: true,
    transformer: new EmptyStringToNull()
  })
  nationality: string;

  @Column("date", { nullable: true, transformer: new EmptyStringToNull() })
  birth: Date;

  @Column("enum", {
    enum: ENUMCivilStatus,
    nullable: true,
    transformer: new EmptyStringToNull()
  })
  civilStatus: string;

  @Column("varchar", { nullable: true, transformer: new EmptyStringToNull() })
  website: string;

  @Column("enum", {
    enum: ENUMGender,
    nullable: true,
    transformer: new EmptyStringToNull()
  })
  gender: string;

  @Column({ default: false })
  disability: boolean;

  @Column("varchar", { nullable: true, transformer: new EmptyStringToNull() })
  optionalEmail: string;

  @Column("varchar", { unique: true })
  email: string;

  @Column("text")
  password: string;

  @Index({ fulltext: true })
  @Column("simple-array", {
    nullable: true,
    transformer: new EmptyStringToNull()
  })
  skills: string[];

  // Checking if the user is an UNIMINUTO student or graduate
  @Column({ default: false })
  isStudent: boolean;

  // If `isStudent` is true, this user needs to put a career
  @Column("varchar", { nullable: true })
  universityCareer: string;

  @Column("json", { nullable: true, transformer: new EmptyStringToNull() })
  socialnetwork: Array<{ name: string; url: string }>;

  @Column({ default: false })
  confirmed: boolean;

  @Column({ default: false })
  forgotPasswordLocked: boolean;

  @OneToMany(_ => Language, language => language.user)
  language: Language[];

  @OneToMany(_ => Study, study => study.user)
  study: Study[];

  @OneToMany(_ => Work, work => work.user)
  work: Work[];

  @OneToOne(_ => PreferWork)
  @JoinColumn()
  preferwork: PreferWork;

  @OneToMany(_ => CV, cv => cv.user)
  cv: CV[];

  @OneToMany(_ => Necessity, necessity => necessity.user)
  necessity: Necessity[];

  @ManyToMany(_ => Business, business => business.member)
  member: Business[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
