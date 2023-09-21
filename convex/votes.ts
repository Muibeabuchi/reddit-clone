import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getCommunityVotes = query({
  args: { communityName: v.string() },
  handler: async (ctx, args) => {
    // get current user

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      const communityVotes = await ctx.db
        .query("votes")
        .filter((q) => q.eq(q.field("communityName"), args.communityName))
        .collect();

      return communityVotes;
    }

    // get users tokenidentifier,which is same as profileId
    if (identity) {
      const { tokenIdentifier } = identity;

      const profileId = await ctx.db
        .query("profile")
        .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
        .unique();

      if (!profileId)
        throw new Error(
          "an error occured looking for profileId in profile table"
        );

      const communityVotes = await ctx.db
        .query("votes")
        .withIndex("by_communityName_voterId", (q) => {
          return q
            .eq("communityName", args.communityName)
            .eq("voterId", profileId._id);
        })
        .collect();

      return communityVotes;
    }
  },
});

export const voteOnPost = mutation({
  args: {
    postId: v.id("posts"),
    voteStatus: v.union(v.literal(1), v.literal(-1)),
  },
  handler: async (ctx, args) => {
    // check if the person wanting to vote is authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }
    // get users tokenidentifier,which is same as profileId
    const { tokenIdentifier } = identity;

    // get the profileId of the authentucated user
    const profileId = await ctx.db
      .query("profile")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .unique();

    if (!profileId)
      throw new Error(
        "an error occured looking for profileId in profile table"
      );

    // get the post that is being voted on
    const PostToBeVotedOn = await ctx.db.get(args.postId);
    if (!PostToBeVotedOn)
      throw new Error("The post to be voted on does not exist");

    // check if the user has voted on this post before
    const voteRef = await ctx.db
      .query("votes")
      .withIndex("by_postId_voterId", (q) =>
        q.eq("postId", args.postId).eq("voterId", profileId._id)
      )
      .unique();
    // if the user have not voted on this post before then we create a new vote
    if (!voteRef) {
      await ctx.db.patch(PostToBeVotedOn._id, {
        numberOfVotes: PostToBeVotedOn.numberOfVotes + args.voteStatus,
      });
      return await ctx.db.insert("votes", {
        communityName: PostToBeVotedOn.communityName,
        communityId: PostToBeVotedOn.communityId,
        postId: PostToBeVotedOn._id,
        voterId: profileId._id,
        voteStatus: args.voteStatus,
      });
    } else if (voteRef) {
      const isSameVoteStatus = args.voteStatus === voteRef.voteStatus;
      if (isSameVoteStatus) {
        const negatedVoteStatus = args.voteStatus * -1;
        await ctx.db.patch(PostToBeVotedOn._id, {
          numberOfVotes: PostToBeVotedOn.numberOfVotes + negatedVoteStatus,
        });
        return await ctx.db.delete(voteRef._id);
      } else {
        const doubledVoteStatus = args.voteStatus * 2;

        await ctx.db.patch(PostToBeVotedOn._id, {
          numberOfVotes: PostToBeVotedOn.numberOfVotes + doubledVoteStatus,
        });
        return await ctx.db.patch(voteRef._id, {
          voteStatus: args.voteStatus,
        });
      }
    }
  },
});
