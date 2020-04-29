
export default function(features,oriPro,destPro){
let newFeatures=[];
    features.forEach( feature => {
        let newFeature =  feature.clone()
        let oriGeom =  newFeature.getGeometry();
        let desGeom =  oriGeom.transform(oriPro,destPro);
        newFeature.setGeometry(desGeom);
        newFeatures.push(newFeature);
    });
    return newFeatures
}