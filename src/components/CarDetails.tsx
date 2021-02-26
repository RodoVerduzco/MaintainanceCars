import React, {useState} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

interface Car {
  description: string;
  make: string;
  model: string;
  km?: number;
  estimatedate?: string
  id?: number;
  image: string;
  inMaintainance?: boolean,
  maintainanceInfo?: Maintainance[]
}

interface Maintainance {
  person: string,
  deliveryDate: string,
  identifier: string
}

interface CarDetailsProps {
    car?: Car | null
    removeCar: () => void
    addToMaintainance: (person: string, deliveryDate: string, identifier: string) => void
}

export const CarDetails: React.FC<CarDetailsProps> = 
  ({car, removeCar, addToMaintainance}) => {

    const [identifier, setIdentifier] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [person, setPerson] = useState('');

  return (
    <>
      <Dialog
        open={car!=null}
        onClose={removeCar}
        maxWidth='md'
      >
        <DialogTitle>{car?.model + ' ' + car?.make}</DialogTitle>
        
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField 
                style={{width: '100%'}}
                label='Persona que dará mantenimiento'
                variant='outlined'
                onChange={e => setPerson(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField 
                style={{width: '100%'}}
                label='Fecha estimada de Entrega'
                variant='outlined'
                onChange={e => setDeliveryDate(e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField 
                style={{width: '100%'}}
                label='Identificador del vehículo'
                variant='outlined'
                onChange={e => setIdentifier(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button 
            onClick={removeCar}
            color='secondary' >
            Cancelar
          </Button>
          
          <Button 
            color='primary'
            onClick={() => addToMaintainance(person, deliveryDate, identifier)}
          >
            Agregar a Mantenimiento
          </Button>
        </DialogActions>
      </Dialog>
    </>)
}
