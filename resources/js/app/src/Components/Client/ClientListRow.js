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
import { useHistory } from "react-router-dom";

// Icons
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import VisibilityIcon from "@material-ui/icons/Visibility";
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

const ClientListRow = ({ client, actionList = {} }) => {
    const history = useHistory();

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

    const styles = {
        row: {
            backgroundColor: function(){
                if (client.remaining_days < 3) {
                    return "red";
                }
                else if (client.remaining_days < 7) {
                    return "darkorange";
                }
                else {
                    return "white"
                }
            }()
        },
        cell: {
            color: function(){
                if (client.remaining_days < 3) {
                    return "white";
                }
                else if (client.remaining_days < 7) {
                    return "black";
                }
                else {
                    return "black";
                }
            }()
        }
    };

    const linkToDetailsClient = () => {
        history.push(`/clients/${client.id}`);
    };

    return (
        <Fragment>
            <TableRow style={styles.row}>
                <Hidden smDown>
                    <TableCell style={styles.cell} align="center">
                        {client.ci}
                    </TableCell>
                    <TableCell style={styles.cell} align="left">
                        {client.fullName}
                    </TableCell>
                    <TableCell style={styles.cell} align="center">
                        {client.remaining_days !== null &&
                            client.remaining_days}
                    </TableCell>
                    <TableCell style={styles.cell} align="center">
                        {!!client.phone && client.phone}
                    </TableCell>
                    <TableCell style={styles.cell} align="center">
                        {!!client.coach && client.coach.name}
                    </TableCell>
                    <TableCell style={styles.cell} align="center">
                        {!!client.schedule && client.schedule.fullTime}
                    </TableCell>
                    <TableCell style={styles.cell} align="center">
                        {!!client.membership && client.membership.name}
                    </TableCell>
                    <TableCell style={styles.cell} align="center">
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
                    <TableCell style={styles.cell} align="center">
                        <Grid container>
                            <Grid
                                item
                                xs={8}
                                style={{
                                    textAlign: "left",
                                    alignSelf: "center"
                                }}
                            >
                                <Typography>CI: {client.ci}</Typography>
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
                                    Nombre: {client.fullName}
                                </Typography>
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
                                    Dias Restantes:{" "}
                                    {client.remaining_days !== null &&
                                        client.remaining_days}
                                </Typography>
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
                                    Coach:{" "}
                                    {!!client.coach && client.coach.name}
                                </Typography>
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
                                    Horario:{" "}
                                    {!!client.schedule && client.schedule.fullTime}
                                </Typography>
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
                                    Afiliacion:{" "}
                                    {!!client.membership && client.membership.name}
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
                <StyledMenuItem
                    onClick={() => {
                        handleCloseActions();
                        actionList.generatePayment(client);
                    }}
                >
                    <ListItemIcon>
                        <LocalAtmIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Realizar Pago" />
                </StyledMenuItem>
                <StyledMenuItem onClick={linkToDetailsClient}>
                    <ListItemIcon>
                        <VisibilityIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Ver" />
                </StyledMenuItem>
                <StyledMenuItem
                    onClick={() => {
                        handleCloseActions();
                        actionList.edit(client);
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
                    disabled={!client.phone}
                    onClick={() => {
                        handleCloseActions();
                        actionList.message(client);
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
                    {"¿ Eliminar cliente ?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {`¿ Estas seguro de eliminar a ${client.fullName} ?`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => {
                            actionList.delete(client);
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

export default ClientListRow;
