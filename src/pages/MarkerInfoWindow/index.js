import React, { Component, Fragment } from 'react';
// import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';

import { Link } from 'react-router-dom';
import api from '../../services/api';
// examples:
import GoogleMap from '../../components/GoogleMap';

// consts: [34.0522, -118.2437]
import SANTA_MARIA_CENTER from '../../const/la_center';

import Ciclismo from '../../images/Ciclismo.png';
import Corrida from '../../images/Corrida.png';
import Distancia from '../../images/Distancia.png';
import Calendario from '../../images/Calendario.svg';

import { List } from './styles';

let userLogged;
// InfoWindow component
const InfoWindow = props => {
  const { place } = props;
  const infoWindowStyle = {
    position: 'relative',
    bottom: 150,
    left: '-45px',
    width: 220,
    backgroundColor: '#5fff5c',
    boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
    borderRadius: '10%',
    padding: 10,
    fontSize: 14,
    zIndex: 100,
  };

  const buttonStyle = {
    borderRadius: '15px',
    width: '130px',
    height: '30px',
    borderWidth: '0px',
    backgroundColor: '#4a82ff',
    color: 'white',
    fontSize: '15px',
    fontWeight: '700',
    marginTop: '15px',
  };

  return (
    <div style={infoWindowStyle}>
      <div style={{ fontSize: 20, fontWeight: 'bold', color: '#656565' }}>
        <span>{place.name}</span>
        <span style={{ float: 'right' }}>x</span>
      </div>
      <div style={{ fontSize: 15 }}>
        <img
          src={Distancia}
          alt="Distancia"
          width="25"
          style={{ verticalAlign: 'middle' }}
        />
        <span
          style={{ color: 'grey', verticalAlign: 'middle', marginLeft: '10px' }}
        >
          {place.distance}km{' '}
        </span>
      </div>
      <div style={{ fontSize: 15 }}>
        <img
          src={Calendario}
          alt="Calendario"
          width="25"
          style={{ verticalAlign: 'middle' }}
        />
        <span
          style={{ color: 'grey', verticalAlign: 'middle', marginLeft: '10px' }}
        >
          {place.period}{' '}
        </span>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button onClick={() => participarEvento(place)} style={buttonStyle}>
          Participar
        </button>
      </div>
    </div>
  );
};

function participarEvento(place) {
  api
    .post('/applies', {
      event_id: place.id,
      user_id: userLogged.id,
      status_id: 1,
      created_at: new Date(),
    })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
}

// Marker component
const Marker = props => {
  const markerStyle = {
    height: '30px',
    width: '30px',
    backgroundImage:
      props.sport_type_id == 1 ? `url(${Ciclismo})` : `url(${Corrida})`,
    backgroundSize: 'cover',
    cursor: 'pointer',
    zIndex: 10,
  };

  return (
    <>
      <div style={markerStyle} />
      {props.show && <InfoWindow place={props.place} />}
    </>
  );
};

class MarkerInfoWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      places: [],
      users: [],
      userLogged: null,
    };
  }

  componentDidMount() {
    fetch('http://10.39.5.57:3333/users')
      .then(response => response.json())
      .then(data => {
        data.forEach(result => {
          result.show = false; // eslint-disable-line no-param-reassign
        });
        this.setState({ users: data, userLogged: data[0] });
        userLogged = data[0];
      });
    fetch('http://10.39.5.57:3333/events')
      .then(response => response.json())
      .then(data => {
        data.forEach(result => {
          result.show = false; // eslint-disable-line no-param-reassign
        });
        this.setState({ places: data });
      });
  }

  // onChildClick callback can take two arguments: key and childProps
  onChildClickCallback = key => {
    this.setState(teste => {
      const index = teste.places.findIndex(
        e => parseInt(e.id) === parseInt(key)
      );
      teste.places[index].show = !teste.places[index].show; // eslint-disable-line no-param-reassign
      return { places: teste.places };
    });
  };

  render() {
    const { places, users } = this.state;
    return (
      <>
        {!isEmpty(places) && (
          <GoogleMap
            defaultZoom={10}
            defaultCenter={SANTA_MARIA_CENTER}
            bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_KEY }}
            onChildClick={this.onChildClickCallback}
          >
            {places.map(place => (
              <Marker
                key={place.id}
                lat={place.lat}
                lng={place.lng}
                show={place.show}
                place={place}
                sport_type_id={place.sport_type_id}
              />
            ))}
          </GoogleMap>
        )}
        <List>
          {users.map(r => (
            <li key={r.name}>
              <span>{r.name}</span>
              <button onClick={() => (userLogged = r)}>Trocar</button>
            </li>
          ))}
        </List>
      </>
    );
  }
}

// InfoWindow.propTypes = {
//   place: PropTypes.shape({
//     name: PropTypes.string,
//     formatted_address: PropTypes.string,
//     rating: PropTypes.number,
//     types: PropTypes.array,
//     price_level: PropTypes.number,
//     opening_hours: PropTypes.object,
//   }).isRequired,
// };

// Marker.propTypes = {
//   show: PropTypes.bool.isRequired,
//   place: PropTypes.shape({
//     name: PropTypes.string,
//     formatted_address: PropTypes.string,
//     rating: PropTypes.number,
//     types: PropTypes.array,
//     price_level: PropTypes.number,
//     opening_hours: PropTypes.object,
//   }).isRequired,
// };

export default MarkerInfoWindow;
