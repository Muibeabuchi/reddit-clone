import { Box, Skeleton, SkeletonText, Stack } from "@chakra-ui/react";

// type Props = {}

const PostLoader = ({ numberOfSkeletons }: { numberOfSkeletons: number }) => {
  const arr1 = new Array(numberOfSkeletons).fill(0).map((_, index) => ({
    id: index,
  }));

  // console.log(arr1);w
  return (
    <Stack spacing={6}>
      {arr1.map((item) => {
        return (
          <Box
            padding="10px 10px"
            boxShadow="lg"
            bg="white"
            borderRadius={4}
            key={item.id}
          >
            <SkeletonText noOfLines={1} mt="4" width={"40%"} spacing={"4"} />
            <SkeletonText noOfLines={4} mt="4" spacing={"4"} />
            <Skeleton mt="4" height="200px" />
          </Box>
        );
      })}

      {/* <Box padding="10px 10px" boxShadow="lg" bg="white" borderRadius={4}>
        <SkeletonText noOfLines={1} mt="4" width={"40%"} spacing={"4"} />
        <SkeletonText noOfLines={4} mt="4" spacing={"4"} />
        <Skeleton mt="4" height="200px" />
      </Box>
      <Box padding="10px 10px" boxShadow="lg" bg="white" borderRadius={4}>
        <SkeletonText noOfLines={1} mt="4" width={"40%"} spacing={"4"} />
        <SkeletonText noOfLines={4} mt="4" spacing={"4"} />
        <Skeleton mt="4" height="200px" />
      </Box>
      <Box padding="10px 10px" boxShadow="lg" bg="white" borderRadius={4}>
        <SkeletonText noOfLines={1} mt="4" width={"40%"} spacing={"4"} />
        <SkeletonText noOfLines={4} mt="4" spacing={"4"} />
        <Skeleton mt="4" height="200px" />
      </Box> */}
    </Stack>
  );
};

export default PostLoader;
