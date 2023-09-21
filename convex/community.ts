// import { api } from "./_generated/api";
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
      communityMembers: [tokenIdentifier],
      communityName: args.communityName,
      communityType: args.communityType,
      creatorId: tokenIdentifier,
      communityImage: "",
    });

    // patch not add

    await ctx.db.patch(profileId._id, {
      communities: [...profileId.communities, communityId],
    });

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

    // get the community that we wanna join
    const community = await ctx.db
      .query("community")
      .withIndex("by_communityName", (q) =>
        q.eq("communityName", args.communityName)
      )
      .unique();
    const communityMembers = community?.communityMembers;

    const usersCommunities = UserProfile?.communities;
    console.log(usersCommunities);

    const isMemberOfCommunity = !!usersCommunities?.find(
      (item) => item === community?._id
    );

    const filteredUserCommunities = usersCommunities.filter(
      (c) => c !== community?._id
    );

    if (isMemberOfCommunity) {
      if (!community?._id) return;

      console.log("removing communityid from users community");
      // if user is member of community remove communityId from the users communities
      await ctx.db.patch(UserProfile?._id, {
        communities: [...filteredUserCommunities],
      });
      // if user is member of community remove userId from the community members
      await ctx.db.patch(community?._id, {
        communityMembers: communityMembers?.filter(
          (c) => c !== identity.tokenIdentifier
        ),
      });
      return "user has been successfully removed from community";
    } else if (!isMemberOfCommunity) {
      if (!community) return;
      if (!communityMembers) return;
      // if user is not member of community add communityId from the users communities
      await ctx.db.patch(UserProfile?._id, {
        communities: [...usersCommunities, community?._id],
      });
      await ctx.db.patch(community?._id, {
        communityMembers: [...communityMembers, identity.tokenIdentifier],
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
