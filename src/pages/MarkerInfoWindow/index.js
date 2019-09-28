import React, { Component, Fragment } from 'react';
// import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';

// examples:
import GoogleMap from '../../components/GoogleMap';

// consts: [34.0522, -118.2437]
import SANTA_MARIA_CENTER from '../../const/la_center';

// InfoWindow component
const InfoWindow = (props) => {
  const { place } = props;
  const infoWindowStyle = {
    position: 'relative',
    bottom: 150,
    left: '-45px',
    width: 220,
    backgroundColor: 'white',
    boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
    padding: 10,
    fontSize: 14,
    zIndex: 100,
  };

  return (
    <div style={infoWindowStyle}>
      <div style={{ fontSize: 16 }}>
        {place.name}
      </div>
      <div style={{ fontSize: 14 }}>
        <span style={{ color: 'grey' }}>
          {place.name}{' '}
        </span>
        <span style={{ color: 'orange' }}>
          {/* {String.fromCharCode(9733).repeat(Math.floor(place.rating))} */}
        </span>
        <span style={{ color: 'lightgrey' }}>
          {/* {String.fromCharCode(9733).repeat(5 - Math.floor(place.rating))} */}
        </span>
      </div>
      <div style={{ fontSize: 14, color: 'grey' }}>
        {place.name}
      </div>
      <div style={{ fontSize: 14, color: 'grey' }}>
        {/* {'$'.repeat(place.name)} */}
      </div>
      <div style={{ fontSize: 14, color: 'green' }}>
        {true ? 'Open' : 'Closed'}
      </div>
      <button>Participar</button>
    </div>
  );
};

// Marker component
const Marker = (props) => {
  const markerStyle = {
    border: '1px solid white',
    borderRadius: '50%',
    height: 20,
    width: 20,
    backgroundColor: props.show ? 'red' : 'blue',
    cursor: 'pointer',
    zIndex: 10,
  };

  return (
    <Fragment>
      <div style={markerStyle} />
      {props.show && <InfoWindow place={props.place} />}
    </Fragment>
  );
};

class MarkerInfoWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      places: [],
    };
  }

  componentDidMount() {
    fetch('http://10.39.5.57:3333/events')
      .then(response => response.json())
      .then((data) => {
        data.forEach((result) => {
          result.show = false; // eslint-disable-line no-param-reassign
        });
        console.log(data);
        this.setState({ places: data });
      });
    console.log(process.env.REACT_APP_MAP_KEY);
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
    const { places } = this.state;

    return (
      <Fragment>
        {!isEmpty(places) && (
          <GoogleMap
            defaultZoom={10}
            defaultCenter={SANTA_MARIA_CENTER}
            bootstrapURLKeys={{ key: process.env.REACT_APP_MAP_KEY }}
            onChildClick={this.onChildClickCallback}
          >
            {places.map(place =>
              (<Marker
                key={place.id}
                lat={place.lat}
                lng={place.lng}
                show={place.show}
                place={place}
              />))}
          </GoogleMap>
        )}
      </Fragment>
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
