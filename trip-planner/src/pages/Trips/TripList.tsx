import React, { useEffect, useState } from "react";
import "./styles/trip-list.css";
import "../../styles/flexbox.css";
import { Button, Card, CardContent, Divider, Menu, MenuItem, Pagination, Tab, Tabs } from "@mui/material";
import { checkTokenValidity } from "../../utils/jwtUtils";
import { toast } from "sonner";
import { useUser } from "../../providers/user-provider/UserContext";
import { refreshAccessToken } from "../../api/AuthenticationService";
import { useNavigate } from "react-router-dom";
import Paths from "../../routes/Paths";
import { getTripsList } from "../../api/TripService";
import { getFormattedDateRange } from "../../utils/date";
import { AddCircleOutline, AddCircleOutlined, Delete, KeyboardArrowDown } from "@mui/icons-material";

const TripList = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openEditMenu = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    const [tabSelected, setTabSelected] = useState(0);
    const [page, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [trips, setTrips] = useState([]);
    const { changeUserInformationToLoggedOut, changeUserInformationToLoggedIn } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const tryFetchingTrips = async () => {
            const accessToken = localStorage.getItem('accessToken');
            setLoading(true);

            if (!checkTokenValidity(accessToken || '')) {
                const result = await refreshAccessToken();
                if (!result.success) {
                    toast.error("Session has expired. Login again!", {
                        position: 'top-center'
                    });

                    changeUserInformationToLoggedOut();
                    navigate(Paths.LOGIN);
                    return;
                }

                changeUserInformationToLoggedIn(result.data.accessToken, result.data.refreshToken);
            }

            const response = await getTripsList(tabSelected, page);
            if (!response || !response.ok) {
                toast.error('Unexpected error. Try again later', {
                    position: 'top-center'
                });
                return;
            }

            const data = await response.json();
            setTrips(data.trips);
            console.log(data);
            setTotalPages(Math.ceil(data.totalTripCount / 5));
            setLoading(false);
        }

        tryFetchingTrips();
    }, [tabSelected, page])

    return (
        <div className="trip-list-container">
            <Tabs
                value={tabSelected}
                onChange={(_, value) => setTabSelected(value)}
                sx={{ marginTop: '25px' }}
            >
                <Tab
                    label="Upcoming Trips"
                    sx={{
                        borderLeft: '1px solid transparent',
                        borderTop: '1px solid transparent',
                        borderRight: '1px solid transparent',
                        ...(tabSelected === 0 && { borderColor: 'rgba(0, 0, 0, 0.12)' }),
                    }}
                />
                <Tab
                    label="Past Trips"
                    sx={{
                        borderLeft: '1px solid transparent',
                        borderTop: '1px solid transparent',
                        borderRight: '1px solid transparent',
                        ...(tabSelected === 1 && { borderColor: 'rgba(0, 0, 0, 0.12)' }),
                    }}
                />
            </Tabs>
            <Divider />
            <Button className="flexbox-container-row row-center-vertically add-trip-button"
                sx={{ 
                    padding: '12px 0px', 
                    "&.MuiButtonBase-root:hover": {
                    bgcolor: "transparent"
                    }
                }}
                disableRipple
                onClick={() => navigate(Paths.CREATE_TRIP)}
            >
                <AddCircleOutline />
                <p style={{ margin: 0 }}>Add a Trip</p>
            </Button>
            {!loading && trips.map((trip: any) => (
                <Card key={trip.id}
                    sx={{
                        height: '220px',
                        width: '100%',
                        borderColor: "rgba(0, 0, 0, 0.3)"
                    }}
                    variant="outlined">
                    <CardContent className="flexbox-container-row"
                        sx={{
                            justifyContent: "space-between",
                            height: "100%",
                            padding: 0
                        }}
                    >
                        <div className="information-container-side">
                            <p>{trip.title}</p>
                            <p>{trip.destinationCountry}</p>
                            <p>{getFormattedDateRange(trip.startDate, trip.endDate)}</p>
                            <div>
                                <span>
                                    <Button variant="outlined" endIcon={<KeyboardArrowDown />} onClick={handleClick}>
                                        Manage Trip
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={openEditMenu}
                                        onClose={handleClose}
                                        disableScrollLock={true}
                                    >
                                        <MenuItem>
                                            Edit Trip Information
                                        </MenuItem>
                                        <MenuItem>
                                            Manage Trip Budgets
                                        </MenuItem>
                                        <MenuItem>
                                            Manage Travellers
                                        </MenuItem>
                                    </Menu>
                                </span>
                                <Button variant="outlined" endIcon={<Delete />} sx={{ marginLeft: '8px' }}>
                                    Delete Trip
                                </Button>
                            </div>
                        </div>
                        <div className="trip-image-container">
                            <img src="/default.jpg" alt="photo" />
                        </div>
                    </CardContent> 
                </Card>
            ))}
            <div className="pagination">
                <Pagination 
                    count={totalPages} 
                    shape="rounded"
                    variant="outlined"
                    onChange={(_, value) => setCurrentPage(value)}
                />
            </div>
        </div>
    )
}

export default TripList;