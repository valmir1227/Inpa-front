import { useRouter } from "next/router";
import { Button } from "./Button";

export const BackButton: React.FC = () => {
  const router = useRouter();
  return (
    <Button
      fontSize={14}
      color="bg"
      textColor="cinzaescuro"
      variant="secondary"
      title="Voltar"
      onClick={() => router.back()}
    />
  );
};
