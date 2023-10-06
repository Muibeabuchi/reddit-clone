import { v } from "convex/values";
import { query } from "./_generated/server";

export const isMemberOfCommunity = query({
  args: {
    communityId: v.id("community"),
  },
  handler: async (ctx, args) => {
    // use the userAuthToken to get the userId

    // check if user is authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return;
    }
    // get users tokenidentifier,which is same as profileId
    const { tokenIdentifier } = identity;
    // get id of user profile
    const profileId = await ctx.db
      .query("profile")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .unique();

    if (!profileId) return;

    const usersCommunities = await ctx.db
      .query("usersCommunities")
      .withIndex("by_community_Profile", (q) =>
        q.eq("communityId", args.communityId).eq("profileId", profileId._id)
      )
      .filter((q) => q.eq(q.field("communityId"), args.communityId))
      .unique();

    if (usersCommunities) {
      return true;
    } else {
      return false;
    }
  },
});
