import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  community: defineTable({
    creatorId: v.string(),
    communityName: v.string(),
    communityType: v.union(
      v.literal("private"),
      v.literal("public"),
      v.literal("restricted")
    ),

    communityMembers: v.number(),
    communityImage: v.string(),
  })
    .index("by_communityName", ["communityName"])
    .index("by_communityMembers", ["communityMembers"])
    .searchIndex("search_communityName", {
      searchField: "communityName",
      // filterFields: ['']
    }),
  profile: defineTable({
    tokenIdentifier: v.string(),
    profileName: v.string(),
    userEmail: v.optional(v.string()),
    userProfilePic: v.optional(v.string()),
    // communities: v.array(v.id("community")),
  }).index("by_token", ["tokenIdentifier"]),
  posts: defineTable({
    authorId: v.id("profile"), // use the users profile convex id ----ensures direct querying of the users data
    authorName: v.string(),
    communityId: v.id("community"), // community convex id ....could use name of community
    communityName: v.string(),
    postBody: v.string(),
    postTitle: v.string(),
    numberOfComments: v.number(),
    communityImageUrl: v.optional(v.string()),
    numberOfVotes: v.number(),
    postImageId: v.string(),
  })
    .index("by_authorId", ["authorId"])
    .index("by_communityId", ["communityId"]),
  votes: defineTable({
    voterId: v.id("profile"),
    communityId: v.id("community"),
    communityName: v.string(),
    voteStatus: v.union(v.literal(1), v.literal(-1)),
    postId: v.id("posts"),
  })
    .index("by_communityName_voterId", ["communityName", "voterId"])
    .index("by_postId_voterId", ["postId", "voterId"])
    .index("by_PostIndex", ["postId"]),

  comments: defineTable({
    commentBody: v.string(),
    communityName: v.string(),
    communityId: v.id("community"),
    postId: v.id("posts"),
    authorId: v.id("profile"),
    authorName: v.string(),
    numberOfVotes: v.number(),
  })
    .index("by_postId", ["postId"])
    .index("by_communityName", ["communityName"]),
  commentVotes: defineTable({
    commentId: v.id("comments"),
    voterId: v.id("profile"),
    voteStatus: v.union(v.literal(1), v.literal(-1)),
    voterAuthToken: v.string(),
  })
    .index("by_commentId", ["commentId"])
    .index("by_commentId_AuthorId", ["commentId", "voterId"]),
  usersCommunities: defineTable({
    communityName: v.string(),
    communityId: v.id("community"),
    profileId: v.id("profile"),
    userAuthToken: v.string(),
  })
    .index("by_community", ["communityId"])
    .index("by_profile", ["profileId"])
    .index("by_community_Profile", ["communityId", "profileId"]),
});
