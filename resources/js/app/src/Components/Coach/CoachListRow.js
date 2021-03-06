import React, { Fragment, useState } from "react";
import {
    Grid,
    Hidden,
    IconButton,
    TableCell,
    TableRow,
    Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// Icons
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SendIcon from "@material-ui/icons/Send";

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

const CoachListRow = ({ coach, actionList = {} }) => {
    const [openActions, setOpenActions] = useState(null);

    const handleOpenActions = event => {
        setOpenActions(event.currentTarget);
    };

    const handleCloseActions = () => {
        setOpenActions(null);
    };

    // State for delete dialog
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleClickOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    return (
        <Fragment>
            <TableRow>
                <Hidden mdDown>
                    <TableCell align="center">{coach.ci}</TableCell>
                    <TableCell align="center">{coach.name}</TableCell>
                    <TableCell align="center">
                        {coach.first_last_name}
                    </TableCell>
                    <TableCell align="center">
                        {coach.second_last_name}
                    </TableCell>
                    <TableCell align="center">
                        {!!coach.phone && coach.phone}
                    </TableCell>
                    <TableCell align="center">
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={handleOpenActions}
                            startIcon={<ArrowDropDownIcon />}
                        >
                            Acciones
                        </Button>
                    </TableCell>
                </Hidden>
                <Hidden mdUp>
                    <TableCell align="center">
                        <Grid container>
                            <Grid
                                item
                                xs={8}
                                style={{
                                    textAlign: "left",
                                    alignSelf: "center"
                                }}
                            >
                                <Typography>CI: {coach.ci}</Typography>
                            </Grid>
                            <Grid item xs={4} style={{ textAlign: "right" }}>
                                <IconButton
                                    onClick={handleOpenActions}
                                    aria-label="actions"
                                    size="small"
                                >
                                    <ArrowDropDownIcon />
                                </IconButton>
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                style={{
                                    textAlign: "left",
                                    alignSelf: "center"
                                }}
                            >
                                <Typography>
                                    Nombre: {coach.fullName}
                                </Typography>
                            </Grid>
                        </Grid>
                    </TableCell>
                </Hidden>
            </TableRow>
            <StyledMenu
                id="customized-menu"
                anchorEl={openActions}
                keepMounted
                open={Boolean(openActions)}
                onClose={handleCloseActions}
            >
                {/* <StyledMenuItem>
                    <ListItemIcon>
                        <VisibilityIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Ver" />
                </StyledMenuItem> */}
                <StyledMenuItem
                    onClick={() => {
                        handleCloseActions();
                        actionList.edit(coach);
                    }}
                >
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Editar" />
                </StyledMenuItem>
                <StyledMenuItem
                    onClick={() => {
                        handleCloseActions();
                        handleClickOpenDeleteDialog();
                    }}
                >
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Eliminar" />
                </StyledMenuItem>
                <StyledMenuItem
                    disabled={!coach.phone}
                    onClick={() => {
                        handleCloseActions();
                        actionList.message(coach);
                    }}
                >
                    <ListItemIcon>
                        <SendIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Enviar Mensaje" />
                </StyledMenuItem>
            </StyledMenu>
            <Dialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"¿ Eliminar Coach ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`¿ Estas seguro de eliminar a ${coach.fullName} ?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => {
                            actionList.delete(coach);
                        }}
                        color="primary"
                        autoFocus
                    >
                        Aceptar
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default CoachListRow;
