import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const getPostComments = query({
  args: {
    paginationOpts: paginationOptsValidator,
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const postComment = await ctx.db
      .query("comments")
      .filter((q) => q.eq(q.field("postId"), args.postId))
      .order("desc")
      // .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .paginate(args.paginationOpts);
    return postComment;
  },
});

export const createComment = mutation({
  args: {
    commentBody: v.string(),
    // authorName: v.string(),
    communityName: v.string(),
    // communityId: v.id("community"),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    // check if the user is authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }
    // get users tokenidentifier,which is same as profileId
    const { tokenIdentifier } = identity;

    // get id of user profile
    const profileRef = await ctx.db
      .query("profile")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .unique();

    if (!profileRef)
      throw new Error(
        "an error occured looking for profileRef in profile table"
      );

    // get the communityId
    const communityRef = await ctx.db
      .query("community")
      .withIndex("by_communityName", (q) =>
        q.eq("communityName", args.communityName)
      )
      .unique();

    if (!communityRef)
      throw new Error("the comment has no coreesponding community");

    await ctx.db.insert("comments", {
      authorId: profileRef._id,
      authorName: profileRef.profileName,
      commentBody: args.commentBody,
      communityId: communityRef._id,
      communityName: args.communityName,
      // pass 0 as the number of votes on a comment
      numberOfVotes: 0,
      postId: args.postId,
    });
  },
});
