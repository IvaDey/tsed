import {Model} from "objection";

import {BelongsToOne} from "./belongsToOne.js";
import {Entity} from "./entity.js";
import {IdColumn} from "./idColumn.js";

describe("@BelongsToOne", () => {
  it("should set metadata", () => {
    @Entity("user")
    class User extends Model {
      @IdColumn()
      id!: string;
    }

    @Entity("movie")
    class Movie extends Model {
      @IdColumn()
      id!: string;
      userId!: string;
      @BelongsToOne()
      user?: User;
    }
    expect(Movie.relationMappings).toEqual({
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "movie.userId",
          to: "user.id"
        }
      }
    });
  });
  it("should set custom relationship path", () => {
    @Entity("user")
    class User extends Model {
      @IdColumn()
      id!: string;
      userId!: string;
    }
    @Entity("movie")
    class Movie extends Model {
      @IdColumn()
      id!: string;
      ownerId!: string;
      @BelongsToOne({from: "ownerId", to: "userId"})
      user?: User;
    }
    expect(Movie.relationMappings).toEqual({
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "movie.ownerId",
          to: "user.userId"
        }
      }
    });
  });
  it("should set custom relationship model", () => {
    @Entity("user")
    class User extends Model {
      @IdColumn()
      id!: string;
    }
    @Entity("movie")
    class Movie extends Model {
      @IdColumn()
      id!: string;
      userId!: string;
      @BelongsToOne(() => User)
      user?: User;
    }
    expect(Movie.relationMappings).toEqual({
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "movie.userId",
          to: "user.id"
        }
      }
    });
  });

  it("should set custom relationship model and relationship path", () => {
    @Entity("user")
    class User extends Model {
      @IdColumn()
      id!: string;
      userId!: string;
    }
    @Entity("movie")
    class Movie extends Model {
      @IdColumn()
      id!: string;
      ownerId!: string;
      @BelongsToOne(() => User, {from: "ownerId", to: "userId"})
      user?: User;
    }
    expect(Movie.relationMappings).toEqual({
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "movie.ownerId",
          to: "user.userId"
        }
      }
    });
  });
  it("should work when options supplied as 2nd argument without first provided", () => {
    @Entity("user")
    class User extends Model {
      @IdColumn()
      id!: string;
      userId!: string;
    }
    @Entity("movie")
    class Movie extends Model {
      @IdColumn()
      id!: string;
      ownerId!: string;
      @BelongsToOne(undefined, {from: "ownerId", to: "userId"})
      user?: User;
    }
    expect(Movie.relationMappings).toEqual({
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "movie.ownerId",
          to: "user.userId"
        }
      }
    });
  });
});
