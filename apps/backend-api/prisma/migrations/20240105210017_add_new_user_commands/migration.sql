 -- This is an empty migration.
insert into
  "public"."Command" ("description", "name")
values
  ('Jump', 'jump');

insert into
  "public"."Command" ("description", "name")
values
  ('Color', 'color');

insert into
  "UserCommand" (text, "commandId", "userId")
with
  t1 as (
    select
      id,
      CONCAT('!', name) AS "text"
    from
      "Command"
    where
      name = 'jump'
      or name = 'color'
  ),
  t2 as (
    select
      id
    from
      "User"
  )
select
  t1.text,
  t1.id,
  t2.id
from
  t1,
  t2;
