import { FC } from "react";

interface pageProps {
  params: { name: string };
}

const page: FC<pageProps> = ({ params }) => {
  console.log(params);
  return <div>other name: {params.name}</div>;
};

export default page;
