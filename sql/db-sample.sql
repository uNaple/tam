CREATE TABLE IF NOT EXISTS public.priority (
  id bigserial NOT NULL,
  sign character varying(32) NOT NULL,
  description character varying(64),
  PRIMARY KEY (id)
) WITH ( OIDS=FALSE );

CREATE TABLE IF NOT EXISTS public.type (
  id bigserial NOT NULL,
  sign character varying(32) NOT NULL,
  description character varying(64),
  PRIMARY KEY (id)
) WITH ( OIDS=FALSE );

CREATE TABLE IF NOT EXISTS public.status (
  id bigserial NOT NULL,
  sign character varying(32) NOT NULL,
  description character varying(64),
  color character varying(16),
  PRIMARY KEY (id)
) WITH ( OIDS=FALSE );

CREATE TABLE IF NOT EXISTS public.scope (
  id bigserial NOT NULL,
  sign character varying(32) NOT NULL,
  decription character varying(64),
  PRIMARY KEY (id)
) WITH ( OIDS=FALSE );

CREATE TABLE IF NOT EXISTS public.global_permissions (
  id bigserial NOT NULL,
  sign character varying(32) NOT NULL,
  PRIMARY KEY (id)
) WITH ( OIDS=FALSE );

CREATE TABLE IF NOT EXISTS public.group_permissions (
  id bigserial NOT NULL,
  sign character varying(32) NOT NULL,
  PRIMARY KEY (id)
) WITH ( OIDS=FALSE );

CREATE TABLE IF NOT EXISTS public.type_action (
  id bigserial NOT NULL,
  sign character varying(32) NOT NULL,
  description character varying(64) NOT NULL,
  PRIMARY KEY (id)
) WITH ( OIDS=FALSE );

CREATE TABLE IF NOT EXISTS public.users (
  id bigserial NOT NULL,
  name character varying(32) NOT NULL,
  password character varying(128) NOT NULL,
  email character varying(128) NOT NULL UNIQUE,
  global_permission integer NOT NULL,
  group_permission integer NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (global_permission) REFERENCES public.global_permissions(id) MATCH FULL
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (group_permission) REFERENCES public.group_permissions(id) MATCH FULL
    ON UPDATE CASCADE ON DELETE CASCADE
) WITH ( OIDS=FALSE );

CREATE TABLE IF NOT EXISTS public.notifications (
  id bigserial NOT NULL,
  timeOf TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  taskid integer NOT NULL,
  userid integer NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (userid) REFERENCES public.users(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) WITH ( OIDS=FALSE );

CREATE TABLE IF NOT EXISTS public.tasks (
  id bigserial NOT NULL,
  name character varying(128) NOT NULL,
  type integer NOT NULL,
  director integer NOT NULL,
  controller integer,
  executor integer,
  time_add TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  time_start TIMESTAMP WITHOUT TIME ZONE,
  time_end TIMESTAMP WITHOUT TIME ZONE,
  duration integer,
  status integer NOT NULL,
  priority integer,
  dependence integer,
  parentid integer,
  description TEXT,
  reminder integer,
  scope integer,
  PRIMARY KEY(id),
  FOREIGN KEY (type) REFERENCES public.type(id) MATCH FULL
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (director) REFERENCES public.users(id) MATCH FULL
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (controller) REFERENCES public.users(id) MATCH FULL
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (executor) REFERENCES public.users(id) MATCH FULL
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (status) REFERENCES public.status(id) MATCH FULL
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (priority) REFERENCES public.priority(id) MATCH FULL
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (dependence) REFERENCES public.tasks(id) MATCH FULL
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (parentid) REFERENCES public.tasks(id) MATCH FULL
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (reminder) REFERENCES public.notifications(id) MATCH FULL
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (scope) REFERENCES public.scope(id) MATCH FULL
    ON UPDATE CASCADE ON DELETE CASCADE
) WITH ( OIDS=FALSE );

CREATE TABLE IF NOT EXISTS public.history (
  id bigserial NOT NULL,
  time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  type_action integer NOT NULL,
  description TEXT,
  userid integer NOT NULL,
  taskid integer NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (type_action) REFERENCES public.type_action(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (userid) REFERENCES public.users(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (taskid) REFERENCES public.tasks(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) WITH ( OIDS=FALSE );

ALTER TABLE "notifications" ADD CONSTRAINT "notifications_fk" FOREIGN KEY ("taskid") REFERENCES "tasks"("id");

