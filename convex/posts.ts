import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const createPostArgs = {
  // get the posters profile id and name on the server
  postBody: v.string(),
  postTitle: v.string(),
  postImageId: v.optional(v.string()),
  // we pass in the community_id and community_name
  //   communityId: v.id("community"),
  communityName: v.string(),
  numberOfVotes: v.number(),
};

export const createPost = mutation({
  args: createPostArgs,
  handler: async (ctx, args) => {
    //?get the users auth identity token, use it to query the profile table to get the id and user name

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }
    // get users tokenidentifier,which is same as profileId
    const { tokenIdentifier } = identity;

    const profileId = await ctx.db
      .query("profile")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .unique();

    if (!profileId)
      throw new Error(
        "an error occured looking for profileId in profile table"
      );

    //  ? get  the community id by querying the table with the unique community name

    const communityRef = await ctx.db
      .query("community")
      .withIndex("by_communityName", function (q) {
        return q.eq("communityName", args.communityName);
      })
      .unique();

    if (!communityRef) throw new Error("community could not be found");

    //? create the object that is to be passed to the mutation

    // save the post image if it exists
    const postId = await ctx.db.insert("posts", {
      authorId: profileId._id,
      authorName: profileId.profileName,
      communityId: communityRef._id,
      communityName: args.communityName,
      communityImageUrl: communityRef.communityImage,
      numberOfComments: 0,
      numberOfVotes: 0,
      postBody: args.postBody,
      postImageId: args.postImageId,
      postTitle: args.postTitle,
    });
    return postId;
  },
});

export const getCommunityPosts = query({
  args: { communityName: v.string() },
  handler: async (ctx, args) => {
    // grab the community id using the name
    const communityRef = await ctx.db
      .query("community")
      .withIndex("by_communityName", (q) =>
        q.eq("communityName", args.communityName)
      )
      .unique();

    if (!communityRef) throw new Error("the community dos not exist");

    const communityPosts = await ctx.db
      .query("posts")
      .withIndex("by_communityId", (q) => q.eq("communityId", communityRef._id))
      .order("desc")
      .take(10);

    return communityPosts;
  },
});
