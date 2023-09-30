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
      // .filter((q) => q.eq(q.field("postId"), args.postId))
      .withIndex("by_postId", (q) => q.eq("postId", args.postId))
      .order("desc")
      .paginate(args.paginationOpts);

    // map through the comments and fetch their respective votes
    const commentsWithVotes = Promise.all(
      postComment.page.map(async (comment) => {
        const votes = await ctx.db
          .query("commentVotes")
          .withIndex("by_commentId", (q) => q.eq("commentId", comment._id))
          .collect();
        const postCommentsWithVotes = {
          ...comment,
          votes: votes,
        };
        return postCommentsWithVotes;
      })
    );

    return commentsWithVotes;
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

    // check if the post exists and get the reference
    const postRef = await ctx.db.get(args.postId);
    if (!postRef) throw new Error("the post does not exist");

    // update the number of comments field on the post table

    await ctx.db.patch(args.postId, {
      numberOfComments: postRef.numberOfComments + 1,
    });

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

export const deletecomment = mutation({
  args: {
    commentId: v.id("comments"),
    authorId: v.id("profile"),
  },
  handler: async (ctx, args) => {
    // check if user is authenticated

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

    // check if user is creator of comment

    const isCommentAuthor = profileRef._id === args.authorId;

    if (!isCommentAuthor)
      throw new Error(
        "unAuthorized action. this user cant delete this comment"
      );

    // find the comment
    const commentRef = await ctx.db.get(args.commentId);
    if (!commentRef) throw new Error("the comment does not exist");

    // check if the post exists and get the reference
    const postRef = await ctx.db.get(commentRef.postId);
    if (!postRef) throw new Error("the post does not exist");

    // update the number of comments field on the post table

    await ctx.db.patch(commentRef.postId, {
      numberOfComments: postRef.numberOfComments - 1,
    });

    // todo ----  delete all votes associted with the comment
    // delete all the votes on the comment
    // fetch all the votes associated with a comment

    const commentsVotes = await ctx.db
      .query("commentVotes")
      .withIndex("by_commentId", (q) => q.eq("commentId", commentRef._id))
      .collect();

    // map through the comments and delete the votes
    Promise.all(
      commentsVotes.map(async (vote) => {
        await ctx.db.delete(vote._id);
      })
    );

    // delete the comment
    await ctx.db.delete(commentRef._id);
  },
});

export const editComment = mutation({
  args: {
    commentId: v.id("comments"),
    editedCommentBody: v.string(),
  },
  handler: async (ctx, args) => {
    // check if user is authenticated

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called editComment without authentication present");
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

    const commentRef = await ctx.db.get(args.commentId);

    if (!commentRef) throw new Error("the comment does not exist");

    const isAuthorOfComment = profileRef._id === commentRef.authorId;

    if (!isAuthorOfComment)
      throw new Error("this user is not the author of comment");

    await ctx.db.patch(commentRef._id, {
      commentBody: args.editedCommentBody,
    });
  },
});
