import proj4 from 'proj4/dist/proj4'
import {addProjection} from 'ol/proj'
import {addCoordinateTransforms} from 'ol/proj'
import Projection from 'ol/proj/Projection'
export default {
  methods:{
    _load(){
      proj4.defs('EPSG:90',"+proj=tmerc +lat_0=39.12529722222222 +lon_0=117.1967845527778 +k=1 +x_0=99940 +y_0=300000 +ellps=krass +units=m +no_defs ");
      // proj4.defs("EPSG:4509","+proj=tmerc +lat_0=-0.000015 +lon_0=117.000013 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      proj4.defs("EPSG:4509","+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
      var projection90 = new Projection({
        code: 'EPSG:90',
        // extent:[93615.0703125, 236681.1875,
        //   174608.671875, 323471.1875],
        units: 'm',
        axisOrientation: 'neu',
        global: false
      });
      var projection2000 = new Projection({
        code: 'EPSG:4509',
        units: 'm',
        axisOrientation: 'neu',
        global: false
      });
      addProjection(projection90);
      addProjection(projection2000);

      addCoordinateTransforms('EPSG:4326','EPSG:90',function (coordinate) {
        return proj4('EPSG:4326','EPSG:90',coordinate)
      },function (coordinate) {
        return proj4('EPSG:90','EPSG:4326',coordinate)
      });

      addCoordinateTransforms('EPSG:3857','EPSG:4509',function (coordinate) {
        return proj4('EPSG:3857','EPSG:4509',coordinate)
      },function (coordinate) {
        return proj4('EPSG:4509','EPSG:3857',coordinate)
      });
      addCoordinateTransforms('EPSG:4326','EPSG:4509',function (coordinate) {
        return proj4('EPSG:4326','EPSG:4509',coordinate)
      },function (coordinate) {
        return proj4('EPSG:4509','EPSG:4326',coordinate)
      });
      addCoordinateTransforms('EPSG:3857','EPSG:4509',function (coordinate) {
        return proj4('EPSG:3857','EPSG:4509',coordinate)
      },function (coordinate) {
        return proj4('EPSG:4509','EPSG:3857',coordinate)
      });



    }
  },
  mounted(){
    this._load();
  }
}
