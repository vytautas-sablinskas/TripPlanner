import "./styles/trip-detail-view-document.css";

const TripDetailViewDocument = () => {
    const onDocumentClick = () => {
        console.log("Document clicked");
    }

    return (
        <div className="document-card-container" onClick={onDocumentClick}>
            <img src="/default.jpg" alt="Document" className="document-card" />
            <p className="document-card-text">document-text.jpg/pdf</p>
        </div>
    );
};

export default TripDetailViewDocument;