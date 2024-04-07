import { Button } from "@/components/ui/button";
import "./styles/trip-detail-view-document.css";
import { CircleX, Pencil } from "lucide-react";

const TripDetailViewDocument = ({ document } : any) => {
    return (
        <div className="document-card-container">
            <img src={document?.typeOfFile?.includes("image") ? document.linkToFile : "/document-placeholder.png"} alt="Document" className="document-card" height={400} width={400}/>
            <a className="document-card-text" href={document.linkToFile}>{document.name}</a>
            <div className="flex-1 flex items-end">
                <Button variant ="ghost" className="mr-2 p-0 pr-2 justify-start">
                    <Pencil className="w-4 h-4 mr-2"/>
                    Edit
                </Button>
                <Button variant="ghost" className="p-0 pr-2">
                    <CircleX className="w-4 h-4 mr-2"/>
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default TripDetailViewDocument;