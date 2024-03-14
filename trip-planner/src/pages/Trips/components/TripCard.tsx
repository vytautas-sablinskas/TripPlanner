import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button, Menu, MenuItem } from "@mui/material";
import { Delete } from "lucide-react";
import "../styles/trip-list.css";
import { getFormattedDateRange } from "@/utils/date";
import { KeyboardArrowDown } from "@mui/icons-material";

const TripCard = ({ trip }: any) => {
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

  return (
    <Card key={trip.id} className="h-225 w-full mb-6 border border-gray-300">
      <CardContent
        className="flex justify-between h-full"
        style={{ padding: 0 }}
      >
        <div className="flex flex-col flex-grow p-6">
          <div>
            <p style={{ fontSize: "24px" }}>{trip.title}</p>
            <p
              style={{
                marginTop: "4px",
                fontSize: "16px",
                color: "rgba(0, 0, 0, 0.87)",
              }}
            >
              {trip.destinationCountry}
            </p>
            <p
              style={{
                marginTop: "4px",
                fontSize: "16px",
                color: "rgb(102, 102, 102)",
              }}
            >
              {getFormattedDateRange(trip.startDate, trip.endDate)}
            </p>
          </div>
          <div className="mt-4">
            <span>
              <Button
                variant="outlined"
                endIcon={<KeyboardArrowDown />}
                onClick={handleClick}
              >
                Manage Trip
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={openEditMenu}
                onClose={handleClose}
                disableScrollLock={true}
              >
                <MenuItem>Edit Trip Information</MenuItem>
                <MenuItem>Manage Trip Budgets</MenuItem>
                <MenuItem>Manage Travellers</MenuItem>
              </Menu>
            </span>
            <Button
              variant="outlined"
              endIcon={<Delete />}
              sx={{ marginLeft: "8px" }}
            >
              Delete Trip
            </Button>
          </div>
        </div>
        <div className="trip-image-container">
          <img
            src="/default.jpg"
            alt="photo"
            style={{ width: "100%", height: "225px", objectFit: "cover", borderTopRightRadius: '7px', borderBottomRightRadius: '7px' }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TripCard;
