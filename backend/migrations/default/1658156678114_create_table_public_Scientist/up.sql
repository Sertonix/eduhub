CREATE TABLE "public"."Scientist" ("forename" text NOT NULL, "surname" text NOT NULL, "title" text NOT NULL, "subject" text NOT NULL, "contactEmail" text NOT NULL, "contactPhone" Text NOT NULL, "contactName" Text NOT NULL, "id" serial NOT NULL, PRIMARY KEY ("id") );COMMENT ON TABLE "public"."Scientist" IS E'Rent-A-Scientist scientist offers courses';