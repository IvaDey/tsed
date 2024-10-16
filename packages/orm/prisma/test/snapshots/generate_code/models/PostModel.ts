import { Post } from "../client/index";
import { Integer, Required, Property, Allow } from "@tsed/schema";
import { UserModel } from "./UserModel";
import type { Relation } from "@tsed/core";

export class PostModel implements Post {
  @Property(Number)
  @Integer()
  @Required()
  id: number;

  @Property(() => UserModel)
  @Allow(null)
  user: Relation<UserModel> | null;

  @Property(Number)
  @Integer()
  @Allow(null)
  userId: number | null;
}

