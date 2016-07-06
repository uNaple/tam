CREATE TABLE "tasks" (
	"id" bigint NOT NULL,
	"name" character varying(128) NOT NULL,
	"type" int8 NOT NULL,
	"director" int8 NOT NULL,
	"controller" int8,
	"executor" int8,
	"time_add" TIMESTAMP NOT NULL,
	"time_start" TIMESTAMP,
	"time_end" TIMESTAMP,
	"duration" int4,
	"status" int8 NOT NULL,
	"priority" int8,
	"dependence" int8,
	"parentid" int8,
	"description" TEXT,
	"reminder" int8,
	"scope" int8,
	CONSTRAINT tasks_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "users" (
	"id" bigint NOT NULL,
	"name" character varying(32) NOT NULL,
	"password" character varying(128) NOT NULL,
	"email" character varying(128) NOT NULL UNIQUE,
	"global_permission" int8 NOT NULL,
	"group_permission" int8 NOT NULL,
	CONSTRAINT users_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "notifications" (
	"id" bigint NOT NULL,
	"timeOf" TIMESTAMP NOT NULL,
	"taskid" bigint NOT NULL,
	"userid" bigint NOT NULL,
	CONSTRAINT notifications_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "history" (
	"id" bigint NOT NULL,
	"time" TIMESTAMP NOT NULL,
	"type_action" int8 NOT NULL,
	"description" TEXT,
	"userid" bigint NOT NULL,
	"taskid" int8 NOT NULL,
	CONSTRAINT history_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "status" (
	"id" bigint NOT NULL,
	"sign" character varying(32) NOT NULL,
	"description" character varying(64),
	"color" character varying(16),
	CONSTRAINT status_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "scope" (
	"id" bigint NOT NULL,
	"sign" character varying(32) NOT NULL,
	"decription" character varying(64),
	CONSTRAINT scope_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "global_permissions" (
	"id" bigint NOT NULL,
	"sign" character varying(32) NOT NULL,
	CONSTRAINT global_permissions_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "priority" (
	"id" bigint NOT NULL,
	"sign" character varying(32) NOT NULL,
	"description" character varying(64),
	CONSTRAINT priority_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "type" (
	"id" bigint NOT NULL,
	"sign" character varying(32) NOT NULL,
	"description" character varying(64),
	CONSTRAINT type_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "group_permissions" (
	"id" bigint NOT NULL,
	"sign" character varying(32) NOT NULL,
	CONSTRAINT group_permissions_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "type_action" (
	"id" bigint NOT NULL,
	"sign" character varying(32) NOT NULL,
	"description" character varying(64) NOT NULL,
	CONSTRAINT type_action_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "tasks" ADD CONSTRAINT "tasks_fk0" FOREIGN KEY ("type") REFERENCES "type"("id");
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_fk1" FOREIGN KEY ("director") REFERENCES "users"("id");
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_fk2" FOREIGN KEY ("controller") REFERENCES "users"("id");
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_fk3" FOREIGN KEY ("executor") REFERENCES "users"("id");
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_fk4" FOREIGN KEY ("status") REFERENCES "status"("id");
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_fk5" FOREIGN KEY ("priority") REFERENCES "priority"("id");
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_fk6" FOREIGN KEY ("dependence") REFERENCES "tasks"("id");
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_fk7" FOREIGN KEY ("parentid") REFERENCES "tasks"("id");
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_fk8" FOREIGN KEY ("reminder") REFERENCES "notifications"("id");
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_fk9" FOREIGN KEY ("scope") REFERENCES "scope"("id");

ALTER TABLE "users" ADD CONSTRAINT "users_fk0" FOREIGN KEY ("global_permission") REFERENCES "global_permissions"("id");
ALTER TABLE "users" ADD CONSTRAINT "users_fk1" FOREIGN KEY ("group_permission") REFERENCES "group_permissions"("id");

ALTER TABLE "notifications" ADD CONSTRAINT "notifications_fk0" FOREIGN KEY ("taskid") REFERENCES "tasks"("id");
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_fk1" FOREIGN KEY ("userid") REFERENCES "users"("id");

ALTER TABLE "history" ADD CONSTRAINT "history_fk0" FOREIGN KEY ("type_action") REFERENCES "type_action"("id");
ALTER TABLE "history" ADD CONSTRAINT "history_fk1" FOREIGN KEY ("userid") REFERENCES "users"("id");
ALTER TABLE "history" ADD CONSTRAINT "history_fk2" FOREIGN KEY ("taskid") REFERENCES "tasks"("id");








