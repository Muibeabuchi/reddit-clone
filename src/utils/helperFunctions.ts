// import { Doc } from "convex/_generated/dataModel";

// https://dynamic-horse-22.clerk.accounts.dev|user_2VUJhp9ZZhbUkXQgyR7V5sUdFUk
export function getUserIdFromIdentityIdentifier(
  identifier: string | undefined
) {
  const id = identifier?.split("|")[1];
  // console.log(id);
  return id;
}

// const result = getUserIdFromIdentityIdentifier(
//   "https://dynamic-horse-22.clerk.accounts.dev|user_2VUJhp9ZZhbUkXQgyR7V5sUdFUk"
// );

// export function isUserMemberOfCommunity(
//   communityData: Doc<"community">,
//   userId: string | undefined
// ) {
//   // const alteredUserId = getUserIdFromIdentityIdentifier(userId);
//   const communityMembers = communityData.communityMembers.find(
//     (c) => getUserIdFromIdentityIdentifier(c) === userId
//   );
//   if (communityMembers) return true;
//   return false;
// }

// console.log(result);
