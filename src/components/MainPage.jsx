import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

function MainPage() {
    return (
        <Box display="flex" justifyContent="center">
            <div>
                <Link to="/login" style={{ textDecoration: "none", marginRight: "10px" }}>
                    <Button variant="contained">
                        Login
                    </Button>
                </Link>
                <Link to="/sign-up" style={{ textDecoration: "none" }}>
                    <Button variant="contained">
                        Sign Up
                    </Button>
                </Link>
            </div>
        </Box>
    );
}

export default MainPage;
