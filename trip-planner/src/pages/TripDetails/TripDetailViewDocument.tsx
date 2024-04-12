import { Button } from "@/components/ui/button";
import "./styles/trip-detail-view-document.css";
import { CircleX, Pencil } from "lucide-react";
import { useState } from "react";
import DeleteDialog from "@/components/Extra/DeleteDialog";
import EditDocumentDialog from "./TripDocuments/EditDocumentDialog";

const TripDetailViewDocument = ({ document, onDelete, isDeleteLoading, onEdit, isEditLoading, members } : any) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const onEditOfDocument = async (editedDocument: any) => {
        await onEdit({ id: document.id, ...editedDocument });
        setIsEditDialogOpen(false);
    }

    return (
        <div className="document-card-container">
            <img src={document?.typeOfFile?.includes("image") ? document.linkToFile : "/document-placeholder.png"} alt="Document" className="document-card" height={400} width={400}/>
            <a className="document-card-text" href={document.linkToFile}>{document.name}</a>
            <div className="flex-1 flex items-end">
                <Button variant ="ghost" className="mr-2 p-0 pr-2 justify-start" onClick={() => setIsEditDialogOpen(true)}>
                    <Pencil className="w-4 h-4 mr-2"/>
                    Edit
                </Button>
                <Button variant="ghost" className="p-0 pr-2" onClick={() => setIsDeleteDialogOpen(true)}>
                    <CircleX className="w-4 h-4 mr-2"/>
                    Delete
                </Button>
                <DeleteDialog 
                    title="Delete Document"
                    description="Are you sure you want to delete this document?"
                    dialogButtonText="Delete"
                    isLoading={isDeleteLoading}
                    open={isDeleteDialogOpen}
                    setOpen={setIsDeleteDialogOpen}
                    onDelete={() => onDelete(document.id)}
                />
                <EditDocumentDialog 
                    onEdit={onEditOfDocument}
                    isLoading={isEditLoading}
                    open={isEditDialogOpen}
                    setOpen={setIsEditDialogOpen}
                    document={document}
                    members={members}
                />
            </div>
        </div>
    );
};

export default TripDetailViewDocument;