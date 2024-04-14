import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Globe, Phone } from "lucide-react";
import "./styles/final-step-more-information-dialog.css";

const FinalStepMoreInformationDialog = ({
  open,
  setOpen,
  weekdayDescriptions,
  phoneNumber,
  website,
  priceLevel,
}: any) => {
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent className="sm:max-w-[580px] flex flex-col flex-wrap information-dialog-words">
        {(
        phoneNumber ||
        website ||
        weekdayDescriptions ||
        priceLevel) ? (
          (phoneNumber || website || weekdayDescriptions || priceLevel) && (
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
                    <p className="sm:max-w-[500px]">{website}</p>
                  </a>
                )}
              </div>
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
              {priceLevel && (
                <div className="mt-4">
                  <p className="text-xl font-bold">Price Level</p>
                  <p>{priceLevel}</p>
                </div>
              )}
            </div>
          )
        ) : (
          <p className="text-xl font-bold">No Information Found</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FinalStepMoreInformationDialog;
