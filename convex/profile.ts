import { v } from "convex/values";
import { query } from "./_generated/server";

export const getUserProfile = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // get id of user profile
    const profileId = await ctx.db
      .query("profile")
      .withIndex("by_token", (q) =>
        q.eq(
          "tokenIdentifier",
          `https://dynamic-horse-22.clerk.accounts.dev|${args.userId}`
        )
      )
      .unique();

    return profileId?._id;
  },
});
