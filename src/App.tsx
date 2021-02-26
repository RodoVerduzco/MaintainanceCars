import React, {useState, useEffect, useCallback} from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import Axios from 'axios';

import Paper from '@material-ui/core/Paper';

import './App.css';
import {CarDetails} from './components/CarDetails';

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

function App() {
  const [carIndex, setCarIndex] = useState(-1);
  const [selectedCar, setSelectedCar] = useState<Car|null>(null);
  const [vehicles, setVehicles] = useState<Car[]>([]);

  useEffect(() => {
    let car = (carIndex>=0)?vehicles[carIndex]:null;
    setSelectedCar(car);
  }, [vehicles, carIndex])

  const getCars = useCallback(async () => {
    Axios({
      method: "GET",
      url: "http://34.227.93.110:3030/vehicles",
      headers: {
        "Content-Type": "application/json"
      }
      }).then(res => {
        if(res.status === 200) {
          console.log(res);
          setVehicles(res.data.vehicles)
        }
      });
  }, [])

  const updateCars = (carInfo: Car) => {
    Axios({
        method: "PUT",
        url: "http://34.227.93.110:3030/update_vehicle",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          newCars: carInfo
        }
      }).then(res => {
        if(res.status === 201) {
          getCars();
        }
        else {
          alert("Error While saving")
        }
      });
  }

  useEffect(() => {
    getCars();
  }, [getCars])

  const removeCar = () => {
    setCarIndex(-1);
  }

  const addToMaintainance = (person: string, deliveryDate: string, identifier: string) => {
    let car = vehicles[carIndex]; 
    car['inMaintainance'] = true;

    let maintainanceInfo = {
      person: person,
      deliveryDate: deliveryDate,
      identifier: identifier
    };

    if(car.maintainanceInfo) {
      car.maintainanceInfo.push(maintainanceInfo);
    }
    else {
      car.maintainanceInfo = [maintainanceInfo];
    }

    updateCars(car);
    removeCar();
  }

  const selectCar = (i: number) => {
    if(!vehicles[i].inMaintainance === true) {
      setCarIndex(i);
    }
  }
 
  const Body = () => {
    return (
      <TableBody>
        {vehicles.map((row, i) => (
          <TableRow 
            key={row.id + ' ' + i}
            hover
            onClick={() => selectCar(i)}
            style={{background: row.inMaintainance?'#E9EAEC': ''}}
          >
            <TableCell component="th" scope="row">
              <img style={{maxWidth: '150px'}} src={row.image} alt='noImage' />
            </TableCell>
            <TableCell>{row.make}</TableCell>
            <TableCell>{row.model}</TableCell>
            <TableCell>{row.description}</TableCell>
            <TableCell>{row.estimatedate}</TableCell>
            <TableCell>{row.id}</TableCell>
            <TableCell>{row.km? row.km:0}</TableCell>
            <TableCell align='center'>
              {row.inMaintainance? 
                <RemoveCircleIcon color='secondary'/>:
                <CheckCircleIcon color='primary'/>
              }
            </TableCell>
            <TableCell align='center'>{row.maintainanceInfo? row.maintainanceInfo.length:0}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    )

  }

  const CarsTable = () => (
    <Table size="medium">
      {/* Table Header */}
      <TableHead>
        <TableRow>
          <TableCell>Imagen</TableCell>
          <TableCell>Marca</TableCell>
          <TableCell>Submarca</TableCell>
          <TableCell>Descripción</TableCell>
          <TableCell>Fecha Programada</TableCell>
          <TableCell>Identificador del Vehículo</TableCell>
          <TableCell>Kilometraje Actual</TableCell>
          <TableCell>Disponibilidad</TableCell>
          <TableCell>Numero de Mantenimientos Hechos</TableCell>
        </TableRow>
      </TableHead>

      {/* Table Body */}
      <Body />
    </Table>
  )

  return (
    <Grid container direction='row' justify='center' alignItems='center'>

      <Grid item xs={7} >
        <Typography variant='h3'>
          Mantenimiento de Vehículos
        </Typography>
      </Grid>

      <Grid item xs={7}>
        <Paper elevation={3}>
          <CarsTable />
          <CarDetails 
            car={selectedCar} 
            removeCar={removeCar} 
            addToMaintainance={addToMaintainance}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default App;
  
