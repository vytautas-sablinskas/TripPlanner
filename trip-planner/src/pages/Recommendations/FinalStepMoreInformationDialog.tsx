import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Globe, Phone } from "lucide-react";

const FinalStepMoreInformationDialog = ({
  open,
  setOpen,
  weekdayDescriptions,
  phoneNumber,
  website,
}: any) => {
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent>
        {(phoneNumber || website) && (
          <div>
            <p className="text-xl font-bold">Contact Information</p>
            <div className="activity-addresses !mt-2 !gap-2">
              {phoneNumber && (
                <a href={`tel:${phoneNumber}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  {phoneNumber}
                </a>
              )}
              {website && (
                <a href={website} target="_blank" rel="noreferrer">
                  <Globe className="w-4 h-4 mr-2" />
                  {website}
                </a>
              )}
            </div>
          </div>
        )}
        {weekdayDescriptions && weekdayDescriptions.length > 0 && (
          <div className="mt-4">
            <p className="text-xl font-bold mb-2">Working hours</p>
            <ul>
              {weekdayDescriptions.map((description: any) => (
                <li key={description}>
                  <p>{description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FinalStepMoreInformationDialog;
