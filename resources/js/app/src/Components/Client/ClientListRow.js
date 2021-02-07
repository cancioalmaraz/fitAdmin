import React, { Fragment, useState } from "react";
import { IconButton, TableCell, TableRow } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

// Icons
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const StyledMenu = withStyles({
    paper: {
        border: "1px solid #d3d4d5"
    }
})(props => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "right"
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles(theme => ({
    root: {
        "&:focus": {
            backgroundColor: theme.palette.primary.main,
            "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                color: theme.palette.common.white
            }
        }
    }
}))(MenuItem);

const ClientListRow = ({ client, actionList = {} }) => {
    const [openActions, setOpenActions] = useState(null);

    const handleOpenActions = event => {
        setOpenActions(event.currentTarget);
    };

    const handleCloseActions = () => {
        setOpenActions(null);
    };

    const styles = {
        row: {
            backgroundColor: client.remaining_days < 7 ? "red" : "white"
        },
        cell: {
            color: client.remaining_days < 7 ? "white" : "black"
        }
    };

    return (
        <Fragment>
            <TableRow style={styles.row}>
                <TableCell style={styles.cell} align="center">
                    {client.ci}
                </TableCell>
                <TableCell style={styles.cell} align="center">
                    {client.name}
                </TableCell>
                <TableCell style={styles.cell} align="center">
                    {client.first_last_name}
                </TableCell>
                <TableCell style={styles.cell} align="center">
                    {client.second_last_name}
                </TableCell>
                <TableCell style={styles.cell} align="center">
                    {client.remaining_days !== null && client.remaining_days}
                </TableCell>
                <TableCell style={styles.cell} align="center">
                    {!!client.phone && client.phone}
                </TableCell>
                <TableCell style={styles.cell} align="center">
                    {!!client.coach && client.coach.name}
                </TableCell>
                <TableCell style={styles.cell} align="center">
                    <IconButton
                        onClick={handleOpenActions}
                        aria-label="actions"
                        size="small"
                    >
                        <ArrowDropDownIcon />
                    </IconButton>
                </TableCell>
            </TableRow>
            <StyledMenu
                id="customized-menu"
                anchorEl={openActions}
                keepMounted
                open={Boolean(openActions)}
                onClose={handleCloseActions}
            >
                <StyledMenuItem>
                    <ListItemIcon>
                        <LocalAtmIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Realizar Pago" />
                </StyledMenuItem>
                <StyledMenuItem>
                    <ListItemIcon>
                        <VisibilityIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Ver" />
                </StyledMenuItem>
                <StyledMenuItem
                    onClick={() => {
                        actionList.edit(client);
                    }}
                >
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Editar" />
                </StyledMenuItem>
                <StyledMenuItem>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Eliminar" />
                </StyledMenuItem>
            </StyledMenu>
        </Fragment>
    );
};

export default ClientListRow;
