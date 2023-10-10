// import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const createCommunityArgs = {
  communityName: v.string(),
  communityType: v.union(
    v.literal("private"),
    v.literal("public"),
    v.literal("restricted")
  ),
  creatorId: v.string(),
  communityImage: v.optional(v.string()),
};

type usersCommunitiesTypes = {
  communityImage: string | undefined;
  communityName: string;
  communityCreator: string;
  communityId: Id<"community">;
};

const getCommunityDataArgs = {
  communityName: v.string(),
};

// export type communityData = Infer<typeof createCommunity>

export const createCommunity = mutation({
  args: createCommunityArgs,
  handler: async (ctx, args) => {
    // check if user is authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }
    // get users tokenidentifier,which is same as profileId
    const { tokenIdentifier } = identity;

    // check if communityName aleady exists
    const communityExist = await ctx.db
      .query("community")
      .filter(function (q) {
        return q.eq(q.field("communityName"), args.communityName);
      })
      .unique();
    // if communityName already exist return error string
    if (communityExist) {
      return `Sorry,r/${args.communityName} is already taken.Try another`;
    }

    // get id of user profile
    const profileId = await ctx.db
      .query("profile")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .unique();

    if (!profileId)
      return "an error occured looking for profileId in profile table";

    const communityId = await ctx.db.insert("community", {
      // communityMembers: [tokenIdentifier],
      communityName: args.communityName,
      communityType: args.communityType,
      creatorId: tokenIdentifier,
      communityImage: "",
      communityMembers: 1,
    });
    // create new document on the usersCommunities table
    await ctx.db.insert("usersCommunities", {
      communityId,
      communityName: args.communityName,
      profileId: profileId._id,
      userAuthToken: tokenIdentifier,
    });

    // // patch not add

    // await ctx.db.patch(profileId._id, {
    //   communities: [...profileId.communities, communityId],
    // });

    return communityId;
  },
});

export const getCommunityData = query({
  args: getCommunityDataArgs,
  handler: async (ctx, args) => {
    const { communityName } = args;

    const communityData = await ctx.db
      .query("community")
      .withIndex("by_communityName", function (q) {
        return q.eq("communityName", communityName);
      })
      .unique();

    if (!communityData) throw new Error("This community does not exist");
    if (communityData.communityImage) {
      const communityImage = await ctx.storage.getUrl(
        communityData?.communityImage
      );
      if (!communityImage) return;
      communityData.communityImage = communityImage;
    }
    return communityData;
  },
});

export const joinOrLeaveCommunity = mutation({
  // pass communityName as an arguement
  args: {
    communityName: v.string(),
  },
  handler: async (ctx, args) => {
    // check if the user is authenticated or has a profile id
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }
    // get users tokenidentifier,which is same as profileId
    // read from the profile table and check if the user is a member of the comunity

    const UserProfile = await ctx.db
      .query("profile")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!UserProfile) return;

    // check if the user has joined this particular community

    // get the community that we wanna join
    const community = await ctx.db
      .query("community")
      .withIndex("by_communityName", (q) =>
        q.eq("communityName", args.communityName)
      )
      .unique();
    if (!community) throw new Error("the community does not exist");

    const hasUserJoinedCommunity = await ctx.db
      .query("usersCommunities")
      .withIndex("by_community_Profile", (q) =>
        q.eq("communityId", community?._id).eq("profileId", UserProfile._id)
      )
      .unique();

    // lets check if the user is the creator of the community
    const isCreatorOfCommunity =
      community.creatorId === identity.tokenIdentifier;
    if (isCreatorOfCommunity) return;

    // const communityMembers = community?.communityMembers;

    // const usersCommunities = UserProfile?.communities;
    // console.log(usersCommunities);

    // const isMemberOfCommunity = !!usersCommunities?.find(
    //   (item) => item === community?._id
    // );

    // const filteredUserCommunities = usersCommunities.filter(
    //   (c) => c !== community?._id
    // );

    if (hasUserJoinedCommunity) {
      if (!community?._id) return;

      // console.log("removing communityid from users community");
      // if user is member of community remove communityId from the users communities
      // await ctx.db.patch(UserProfile?._id, {
      //   communities: [...filteredUserCommunities],
      // });
      // if user is member of community remove userId from the community members
      // await ctx.db.patch(community?._id, {
      //   communityMembers: communityMembers?.filter(
      //     (c) => c !== identity.tokenIdentifier
      //   ),
      // });

      // if user is member of the community delete the document
      await ctx.db.patch(hasUserJoinedCommunity.communityId, {
        communityMembers: community.communityMembers - 1,
      });
      await ctx.db.delete(hasUserJoinedCommunity._id);
      return "user has been successfully removed from community";
    } else if (!hasUserJoinedCommunity) {
      if (!community) return;
      // if (!communityMembers) return;
      // if user is not member of community add communityId from the users communities
      // await ctx.db.patch(UserProfile?._id, {
      //   communities: [...usersCommunities, community?._id],
      // });
      // await ctx.db.patch(community?._id, {
      //   communityMembers: [...communityMembers, identity.tokenIdentifier],
      // });

      // if user is not a member of that community, add a document to the table

      await ctx.db.patch(community._id, {
        communityMembers: community.communityMembers + 1,
      });

      await ctx.db.insert("usersCommunities", {
        communityId: community._id,
        communityName: community.communityName,
        profileId: UserProfile._id,
        userAuthToken: identity.tokenIdentifier,
      });
      return "user has been successfully been added to the community";
    }

    // if the user is a member, remove the community id from the users community array and remove the userid from the community table..using the name of the community since it is unique
    // if the user is not a member, add the communityId to the users coommunity array and add the userId to the communityTable
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const mutateCommunityImage = mutation({
  args: {
    storageId: v.string(),
    author: v.string(),
    communityName: v.string(),
  },
  handler: async (ctx, args) => {
    // check if the person updating the community image is the community creator

    const communityRef = await ctx.db
      .query("community")
      .withIndex("by_communityName", (q) =>
        q.eq("communityName", args.communityName)
      )
      .unique();

    // console.log(
    //   `${import.meta.env.VITE_CLERK_JWT_ISSUER_DOMAIN}|${args.author}`
    // );

    if (!communityRef)
      throw new Error("Failed to get community data from convex");

    const isCommunityCreator =
      communityRef?.creatorId ===
      `https://dynamic-horse-22.clerk.accounts.dev|${args.author}`;

    if (!isCommunityCreator)
      throw new Error("You are not allowed to update thi community's image");
    // update the communities image
    await ctx.db.patch(communityRef._id, { communityImage: args.storageId });
    // delete the old communities photo from file storage
    if (communityRef?.communityImage === "") return;
    await ctx.storage.delete(communityRef.communityImage as string);
  },
});

export const getUserCommunities = query({
  args: {},
  handler: async (ctx) => {
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

    // const usersCommunities = profileId.communities;

    // quwery the usersCommunities table and find all documents where the userId is same as profileId._id

    const usersCommunities = await ctx.db
      .query("usersCommunities")
      .withIndex("by_profile", (q) => q.eq("profileId", profileId._id))
      .collect();

    // if (!usersCommunities) return;

    const usersCommunitiesData = await Promise.all(
      usersCommunities.map(async (community) => {
        const communities = await ctx.db.get(community.communityId);

        if (!communities?.communityImage)
          return {
            communityImage: "",
            communityName: communities?.communityName,
            communityCreator: communities?.creatorId,
            communityId: communities?._id,
          };

        // if (communities?.communityImage !== ') {
        const image = await ctx.storage.getUrl(communities?.communityImage);
        // console.log(community, image);
        // console.log();
        // }
        const communitiesData: usersCommunitiesTypes = {
          communityImage: image ? image : "",
          communityName: communities.communityName,
          communityCreator: communities.creatorId,
          communityId: communities._id,
        };
        return communitiesData;
      })
    );

    // const usersCommunitiesDataAndImage = Promise.all(
    //   usersCommunitiesData.map(async (community) => {
    //     if (!community?.communityImage) return;
    //     const image = await ctx.storage.getUrl(community?.communityImage);
    //     if (!image) return;

    //     const communitiesData: usersCommunitiesTypes = {
    //       communityImage: communities.communityImage,
    //       communityName: communities.communityName,
    //       communityCreator: communities.creatorId,
    //       communityId: communities._id,
    //     };
    //   })
    // );

    return usersCommunitiesData;
  },
});

export const getCommunityRecommendations = query({
  args: {},
  handler: async (ctx) => {
    // query the communities database and pick the first 5 communities with the largest number of members
    // todo---- properly fetch the top 5 communities
    const top5Communities = await ctx.db
      .query("community")
      .withIndex("by_communityMembers")
      .order("desc")
      .take(5);
    const topCommunitiesWithCommunityImage = Promise.all(
      top5Communities.map(async (item) => {
        if (!item.communityImage) {
          return item;
        }
        const communityImage = await ctx.storage.getUrl(item.communityImage);
        return {
          ...item,
          communityImage: communityImage,
        };
      })
    );
    return topCommunitiesWithCommunityImage;
  },
});

export const searchedCommunities = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const searchedCommunities = await ctx.db
      .query("community")
      .withSearchIndex("search_communityName", (q) =>
        q.search("communityName", args.searchTerm)
      )
      .take(5);

    const searchedCommunitiesWithImages = Promise.all(
      searchedCommunities.map(async (item) => {
        if (item.communityImage === "") return item;
        const image = await ctx.storage.getUrl(item.communityImage);
        return {
          ...item,
          communityImage: image ? image : "",
        };
      })
    );

    return searchedCommunitiesWithImages;
  },
});
