
export default function(features,oriPro,destPro){
let newFeatures=[];
    features.forEach(feature => {
        let newFeature = feature.clone()
        let oriGeom = newFeature.getGeometry();
        window.console.log(oriGeom);
        let desGeom = oriGeom.transform(oriPro,destPro);
        window.console.log(desGeom);
        newFeature.setGeometry(desGeom);
        newFeatures.push(newFeature);
    });
    return newFeatures
}