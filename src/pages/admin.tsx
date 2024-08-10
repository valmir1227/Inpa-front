import { Admin } from "components/admin/Admin";
import { AlertInpa } from "components/global/Alert";
import { useMyContext } from "contexts/Context";
import Head from "next/head";
import { Header } from "../components/Header";

export default function AdminPage() {
  const { user } = useMyContext();

  return (
    <>
      <Head>
        <title>Admin | Inpa</title>
        <meta property="og:title" content="Admin | Inpa" />
        <meta name="description" content="#" />
        <meta property="og:description" content="#" />
        <meta property="og:image" content="logo.jpg" key="ogimage" />
      </Head>
      <Header type="admin" />
      <Admin />
    </>
  );
}
