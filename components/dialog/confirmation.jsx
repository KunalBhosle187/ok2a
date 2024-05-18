import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ConfirmationDialog({ id }) {
  const router = useRouter();
  const handleAccess = async (id) => {
    try {
      const res = await fetch("/api/user/grant-access", {
        method: "POST",
        body: JSON.stringify(id),
      });

      const data = await res.json();
      if (res.ok) {
        toast(data);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      toast("Something went wrong");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-full font-normal justify-start"
          variant="ghost"
          size="sm"
        >
          Grant Access
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Grant Database Access</DialogTitle>
          <DialogDescription>
            You are about to grant access to our database. This action will
            allow the user to retrieve data within the database. Are you sure
            you want to proceed with granting access?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => handleAccess(id)}
            >
              <span className="sr-only">Close</span>
              Grant access
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant="destructive">
              <span className="sr-only">Close</span>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
