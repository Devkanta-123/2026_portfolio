'use client';

import { useEffect, useRef, useState } from 'react';
import { Globe, MapPin, Navigation, Target, Compass, ExternalLink, Satellite, Map, Locate, ZoomIn } from 'lucide-react';
import 'ol/ol.css';

interface LocationCoordinates {
  lat: number;
  lng: number;
  name: string;
  address: string;
  details: string;
}

interface AnimationPoint {
  center: [number, number];
  zoom: number;
  duration: number;
}

export function LocationSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const animationRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'satellite' | 'street'>('satellite');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(2);
  const [mapReady, setMapReady] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [droneComplete, setDroneComplete] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Your source location (starting point for drone zoom)
  const sourceLocation = {
    lat: 25.578068478722315,
    lng: 91.89466789826267,
    name: 'Wide View',
    address: 'Starting drone view',
    details: 'Zooming to your location'
  };

  // Your current location (destination)
  const currentLocation = {
    lat: 26.1881,
    lng: 91.6919,
    name: 'IIT Guwahati',
    address: 'Indian Institute of Technology Guwahati, Assam, India',
    details: 'Premier Engineering Institute • Est. 1994'
  };

  // Preload OpenLayers
  useEffect(() => {
    const preloadOL = async () => {
      try {
        // Preload essential OpenLayers modules
        await Promise.all([
          import('ol'),
          import('ol/Map'),
          import('ol/View'),
          import('ol/layer/Tile'),
          import('ol/source/OSM'),
          import('ol/source/XYZ'),
          import('ol/Feature'),
          import('ol/geom/Point'),
          import('ol/proj'),
          import('ol/layer/Vector'),
          import('ol/source/Vector'),
          import('ol/style/Style'),
          import('ol/style/Icon'),
          import('ol/style/Circle'),
          import('ol/style/Fill'),
          import('ol/style/Stroke')
        ]);
        setMapReady(true);
      } catch (error) {
        console.error('Failed to preload OpenLayers:', error);
      }
    };

    preloadOL();
  }, []);

  // Smooth interpolation function
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Drone zoom animation
  const performDroneZoom = (map: any, fromLonLat: any) => {
    if (!map || isAnimating || droneComplete) return;

    setIsAnimating(true);
    setAnimationProgress(0);
    
    const view = map.getView();
    const startPos = fromLonLat([sourceLocation.lng, sourceLocation.lat]);
    const endPos = fromLonLat([currentLocation.lng, currentLocation.lat]);
    
    const startZoom = 2;
    const endZoom = 14;
    const duration = 8000; // 8 seconds for smooth animation
    const startTime = Date.now();
    
    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Update progress for UI
      setAnimationProgress(progress * 100);
      
      // Apply easing
      const easedProgress = easeInOutCubic(progress);
      
      // Calculate current position and zoom
      const currentX = startPos[0] + (endPos[0] - startPos[0]) * easedProgress;
      const currentY = startPos[1] + (endPos[1] - startPos[1]) * easedProgress;
      const currentZoom = startZoom + (endZoom - startZoom) * easedProgress;
      
      // Update view smoothly
      view.setCenter([currentX, currentY]);
      view.setZoom(currentZoom);
      
      // Update zoom level display
      setZoomLevel(Math.round(currentZoom));
      
      if (progress < 1) {
        // Continue animation
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        setIsAnimating(false);
        setDroneComplete(true);
        setZoomLevel(endZoom);
        animationRef.current = null;
        
        // Add a subtle bounce effect at the end
        view.animate({
          zoom: endZoom - 0.2,
          duration: 300,
          easing: (t: number) => t
        }, {
          zoom: endZoom,
          duration: 300,
          easing: (t: number) => t
        });
      }
    };
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
  };

  // Initialize OpenLayers map
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    const initMap = async () => {
      setIsLoading(true);
      
      try {
        const MapModule = await import('ol/Map');
        const Map = MapModule.default;
        const ViewModule = await import('ol/View');
        const View = ViewModule.default;
        const TileLayerModule = await import('ol/layer/Tile');
        const TileLayer = TileLayerModule.default;
        const OSMModule = await import('ol/source/OSM');
        const OSM = OSMModule.default;
        const XYZModule = await import('ol/source/XYZ');
        const XYZ = XYZModule.default;
        const FeatureModule = await import('ol/Feature');
        const Feature = FeatureModule.default;
        const PointModule = await import('ol/geom/Point');
        const Point = PointModule.default;
        const ProjModule = await import('ol/proj');
        const { fromLonLat } = ProjModule;
        const VectorLayerModule = await import('ol/layer/Vector');
        const VectorLayer = VectorLayerModule.default;
        const VectorSourceModule = await import('ol/source/Vector');
        const VectorSource = VectorSourceModule.default;
        const StyleModule = await import('ol/style/Style');
        const Style = StyleModule.default;
        const IconModule = await import('ol/style/Icon');
        const Icon = IconModule.default;
        const CircleModule = await import('ol/style/Circle');
        const CircleStyle = CircleModule.default;
        const FillModule = await import('ol/style/Fill');
        const Fill = FillModule.default;
        const StrokeModule = await import('ol/style/Stroke');
        const Stroke = StrokeModule.default;

        // Create high-resolution satellite source
        const satelliteSource = new XYZ({
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          crossOrigin: 'anonymous',
          attributions: '© Esri, Maxar, Earthstar Geographics, and the GIS User Community',
          maxZoom: 19
        });

        // Enhanced satellite source with different layers for better quality
        const enhancedSatelliteSource = new XYZ({
          url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          crossOrigin: 'anonymous',
          attributions: 'Tiles © Esri',
          maxZoom: 19
        });

        // Street view source
        const osmSource = new OSM();

        // Create layers
        const streetLayer = new TileLayer({
          source: osmSource,
          visible: false,
          properties: { name: 'street' }
        });

        const satelliteLayer = new TileLayer({
          source: satelliteSource,
          visible: true,
          properties: { name: 'satellite' }
        });

        // Additional satellite layer for enhanced quality
        const enhancedSatelliteLayer = new TileLayer({
          source: enhancedSatelliteSource,
          visible: true,
          opacity: 1,
          properties: { name: 'enhanced_satellite' }
        });

        // Create vector source for markers
        const vectorSource = new VectorSource();

        // Create source location marker (starting point)
        const sourceMarker = new Feature({
          geometry: new Point(fromLonLat([sourceLocation.lng, sourceLocation.lat])),
          name: 'Drone Start',
          type: 'source'
        });

        sourceMarker.setStyle(new Style({
          image: new Icon({
            src: 'data:image/svg+xml;base64,' + btoa(`
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="12" fill="none" stroke="#3B82F6" stroke-width="3" stroke-dasharray="4,4"/>
                <circle cx="16" cy="16" r="6" fill="#3B82F680"/>
                <circle cx="16" cy="16" r="2" fill="#3B82F6"/>
              </svg>
            `),
            scale: 1,
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction'
          })
        }));

        // Create destination marker (IIT Guwahati)
        const destinationMarker = new Feature({
          geometry: new Point(fromLonLat([currentLocation.lng, currentLocation.lat])),
          name: currentLocation.name,
          type: 'destination'
        });

        destinationMarker.setStyle(new Style({
          image: new Icon({
            src: 'data:image/svg+xml;base64,' + btoa(`
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="white" stroke="#DC2626" stroke-width="2"/>
                <circle cx="24" cy="24" r="16" fill="#DC2626" fill-opacity="0.2"/>
                <circle cx="24" cy="24" r="12" fill="#DC2626"/>
                <circle cx="24" cy="24" r="4" fill="white"/>
                <circle cx="24" cy="24" r="40" fill="none" stroke="#DC2626" stroke-width="1" stroke-dasharray="3,3" opacity="0.5"/>
              </svg>
            `),
            scale: 1,
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction'
          })
        }));

        vectorSource.addFeature(sourceMarker);
        vectorSource.addFeature(destinationMarker);

        // Create vector layer
        const vectorLayer = new VectorLayer({
          source: vectorSource,
        });

        // Create drone path line
        const dronePathSource = new VectorSource();
        const dronePathFeature = new Feature({
          geometry: new Point(fromLonLat([sourceLocation.lng, sourceLocation.lat])),
          type: 'drone_path'
        });

        const dronePathLayer = new VectorLayer({
          source: dronePathSource,
          style: new Style({
            stroke: new Stroke({
              color: '#60A5FA',
              width: 2,
              lineDash: [10, 5]
            })
          })
        });

        // Create map with starting position
        const map = new Map({
          target: mapRef.current!,
          layers: [satelliteLayer, enhancedSatelliteLayer, streetLayer, dronePathLayer, vectorLayer],
          view: new View({
            center: fromLonLat([sourceLocation.lng, sourceLocation.lat]),
            zoom: zoomLevel,
            minZoom: 2,
            maxZoom: 19,
            constrainResolution: true
          }),
          controls: []
        });

        mapInstanceRef.current = map;

        // Update zoom level in state
        map.getView().on('change:resolution', () => {
          const zoom = map.getView().getZoom();
          if (zoom) setZoomLevel(Math.round(zoom));
        });

        // Get user's location
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userCoords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              setUserLocation(userCoords);

              // Add user location marker
              const userMarker = new Feature({
                geometry: new Point(fromLonLat([userCoords.lng, userCoords.lat])),
                name: 'Your Location',
                type: 'user'
              });

              userMarker.setStyle(new Style({
                image: new CircleStyle({
                  radius: 8,
                  fill: new Fill({ color: '#10B981' }),
                  stroke: new Stroke({ color: '#FFFFFF', width: 3 })
                })
              }));

              vectorSource.addFeature(userMarker);
            },
            (error) => {
              console.error('Error getting location:', error);
              setLocationError('Location access denied. Drone view will continue.');
            }
          );
        } else {
          setLocationError('Geolocation not supported. Drone view will continue.');
        }

        // Start drone zoom animation after a short delay
        setTimeout(() => {
          setIsLoading(false);
          setTimeout(() => {
            performDroneZoom(map, fromLonLat);
          }, 1500); // Wait 1.5 seconds before starting drone animation
        }, 1000);

      } catch (error) {
        console.error('Error initializing map:', error);
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      // Clean up animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, [mapReady]);

  // Update view mode when changed
  useEffect(() => {
    if (!mapInstanceRef.current || isAnimating) return;

    const layers = mapInstanceRef.current.getLayers().getArray();
    const satelliteLayer = layers.find((layer: any) => layer.get('name') === 'satellite');
    const enhancedSatelliteLayer = layers.find((layer: any) => layer.get('name') === 'enhanced_satellite');
    const streetLayer = layers.find((layer: any) => layer.get('name') === 'street');

    if (satelliteLayer && enhancedSatelliteLayer && streetLayer) {
      if (viewMode === 'satellite') {
        satelliteLayer.setVisible(true);
        enhancedSatelliteLayer.setVisible(true);
        streetLayer.setVisible(false);
      } else {
        satelliteLayer.setVisible(false);
        enhancedSatelliteLayer.setVisible(false);
        streetLayer.setVisible(true);
      }
    }
  }, [viewMode, isAnimating]);

  // Handle map click to current location
  const centerToCurrentLocation = () => {
    if (!mapInstanceRef.current) return;

    const ProjModule = require('ol/proj');
    const view = mapInstanceRef.current.getView();
    
    setIsAnimating(true);
    view.animate({
      center: ProjModule.fromLonLat([currentLocation.lng, currentLocation.lat]),
      zoom: 14,
      duration: 2000
    }, () => {
      setIsAnimating(false);
    });
  };

  // Handle map click to source location
  const centerToSourceLocation = () => {
    if (!mapInstanceRef.current) return;

    const ProjModule = require('ol/proj');
    const view = mapInstanceRef.current.getView();
    
    setIsAnimating(true);
    view.animate({
      center: ProjModule.fromLonLat([sourceLocation.lng, sourceLocation.lat]),
      zoom: 2,
      duration: 2000
    }, () => {
      setIsAnimating(false);
      // Restart drone animation
      setDroneComplete(false);
      setTimeout(() => {
        const { fromLonLat } = ProjModule;
        performDroneZoom(mapInstanceRef.current, fromLonLat);
      }, 500);
    });
  };

  // Toggle between satellite and street view
  const toggleViewMode = () => {
    if (isAnimating) return;
    setViewMode(prev => prev === 'satellite' ? 'street' : 'satellite');
  };

  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-gray-950 via-black to-gray-950 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full border border-gray-700">
            <Satellite className="w-5 h-5 text-white" />
            <span className="text-white font-bold tracking-widest text-sm">DRONE VIEW NAVIGATION</span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
            AERIAL LOCATION VIEW
          </h2>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Experience a smooth cinematic drone flight from wide-angle view directly to IIT Guwahati campus
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Information Card */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/40 backdrop-blur-sm rounded-3xl p-8 border border-gray-800 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-xl ${isAnimating ? 'bg-gradient-to-br from-blue-600 to-cyan-500 animate-pulse' : 'bg-gradient-to-br from-red-600 to-red-800'}`}>
                  {isAnimating ? (
                    <Navigation className="w-8 h-8 text-white animate-pulse" />
                  ) : (
                    <MapPin className="w-8 h-8 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Drone Navigation</h3>
                  <p className="text-gray-400">{isAnimating ? 'Flying to destination...' : droneComplete ? 'Destination reached' : 'Ready for takeoff'}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-cyan-400" />
                  <div>
                    <p className="text-sm text-gray-400">Starting Point</p>
                    <p className="text-lg font-mono text-white">
                      {sourceLocation.lat.toFixed(6)}°N, {sourceLocation.lng.toFixed(6)}°E
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Compass className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Destination</p>
                    <p className="text-lg font-mono text-white">
                      {currentLocation.lat}°N, {currentLocation.lng}°E
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ZoomIn className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Current Zoom</p>
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-mono text-white">{zoomLevel}x</div>
                      {isAnimating && (
                        <div className="px-2 py-1 bg-blue-900/30 rounded text-xs text-blue-300 animate-pulse">
                          Zooming...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Satellite className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-sm text-gray-400">View Mode</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-mono text-white capitalize">{viewMode}</span>
                      <button
                        onClick={toggleViewMode}
                        disabled={isAnimating}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          isAnimating 
                            ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-800 text-white hover:bg-gray-700'
                        }`}
                      >
                        Switch View
                      </button>
                    </div>
                  </div>
                </div>

                {userLocation && (
                  <div className="flex items-center gap-3">
                    <Locate className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Your Location</p>
                      <p className="text-lg font-mono text-white">
                        {userLocation.lat.toFixed(4)}°N, {userLocation.lng.toFixed(4)}°E
                      </p>
                    </div>
                  </div>
                )}

                {locationError && (
                  <div className="p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                    <p className="text-sm text-yellow-300">{locationError}</p>
                  </div>
                )}
              </div>

              {/* Animation Progress Bar */}
              {isAnimating && (
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Flight Progress</span>
                    <span>{Math.round(animationProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${animationProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-gray-800">
                <h4 className="text-lg font-semibold text-white mb-4">Drone Controls</h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={centerToSourceLocation}
                    disabled={isAnimating}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                      isAnimating
                        ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90'
                    }`}
                  >
                    <Navigation className="w-4 h-4" />
                    Restart Flight
                  </button>
                  <button
                    onClick={centerToCurrentLocation}
                    disabled={isAnimating}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                      isAnimating
                        ? 'bg-gray-800 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:opacity-90'
                    }`}
                  >
                    <Target className="w-4 h-4" />
                    Go to IIT
                  </button>
                </div>
              </div>

            
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900/60 rounded-2xl p-6 text-center border border-gray-800">
                <div className="text-3xl font-bold text-white mb-2">{Math.round(sourceLocation.lat)}°</div>
                <div className="text-sm text-gray-400">Start Latitude</div>
              </div>
              <div className="bg-gray-900/60 rounded-2xl p-6 text-center border border-gray-800">
                <div className="text-3xl font-bold text-white mb-2">{Math.round(sourceLocation.lng)}°</div>
                <div className="text-sm text-gray-400">Start Longitude</div>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-br from-gray-900/40 to-black/40 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-800 shadow-2xl h-[600px]">
              <div 
                ref={mapRef} 
                className="absolute inset-0 w-full h-full"
              />
              
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20"></div>
                      <div className="relative animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                      <Satellite className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-400" />
                    </div>
                    <p className="text-white text-2xl font-bold mb-4">Initializing Drone Camera</p>
                    <p className="text-gray-400 text-sm max-w-md mb-2">Loading high-resolution satellite imagery...</p>
                    <p className="text-gray-500 text-xs">Flight will begin shortly from {sourceLocation.lat.toFixed(2)}°N, {sourceLocation.lng.toFixed(2)}°E</p>
                  </div>
                </div>
              ) : null}

              {/* Flight Info Overlay */}
              {isAnimating && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-xl px-6 py-3 border border-gray-700">
                  <div className="flex items-center gap-3">
                    <Navigation className="w-5 h-5 text-blue-400 animate-pulse" />
                    <div>
                      <div className="text-white font-semibold">Drone in Flight</div>
                      <div className="text-gray-400 text-sm">Zooming to IIT Guwahati...</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Map Controls Overlay */}
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                <button
                  onClick={toggleViewMode}
                  disabled={isAnimating}
                  className={`flex items-center gap-3 backdrop-blur-sm rounded-xl p-3 border transition-all ${
                    isAnimating
                      ? 'bg-gray-900/60 border-gray-700 cursor-not-allowed'
                      : 'bg-black/80 border-gray-700 hover:bg-gray-900'
                  }`}
                  title={`Switch to ${viewMode === 'satellite' ? 'Street' : 'Satellite'} View`}
                >
                  {viewMode === 'satellite' ? (
                    <Map className="w-5 h-5 text-white" />
                  ) : (
                    <Satellite className="w-5 h-5 text-white" />
                  )}
                  {!isAnimating && (
                    <span className="text-white text-sm hidden lg:block">
                      {viewMode === 'satellite' ? 'Street View' : 'Satellite'}
                    </span>
                  )}
                </button>
                
                <div className="bg-black/80 backdrop-blur-sm rounded-xl p-3 border border-gray-700">
                  <div className="text-xs text-gray-400 mb-1">Zoom Level</div>
                  <div className="text-white font-mono text-lg">{zoomLevel}</div>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                <div className="text-sm font-semibold text-gray-300 mb-3">Flight Legend</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-sm text-white">Flight Start</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-red-500" />
                    <span className="text-sm text-gray-300">IIT Guwahati</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                    <span className="text-sm text-gray-300">Your Location</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 flex items-center justify-center">
                      {viewMode === 'satellite' ? (
                        <Satellite className="w-4 h-4 text-green-400" />
                      ) : (
                        <Map className="w-4 h-4 text-blue-400" />
                      )}
                    </div>
                    <span className="text-sm text-gray-300">
                      {viewMode === 'satellite' ? 'Satellite' : 'Street'} View
                    </span>
                  </div>
                </div>
              </div>

              {/* Flight Status */}
              <div className="absolute bottom-6 left-6 bg-gradient-to-r from-blue-900/80 to-cyan-900/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-blue-700">
                <div className="flex items-center gap-3">
                  {isAnimating ? (
                    <>
                      <div className="animate-pulse">
                        <Navigation className="w-5 h-5 text-blue-300" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">Drone Flying</div>
                        <div className="text-blue-200 text-sm">Altitude: {(zoomLevel * 1000).toLocaleString()} ft</div>
                      </div>
                    </>
                  ) : droneComplete ? (
                    <>
                      <Target className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="text-white font-semibold">Destination Reached</div>
                        <div className="text-green-200 text-sm">IIT Guwahati in view</div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Navigation className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="text-white font-semibold">Ready for Takeoff</div>
                        <div className="text-gray-300 text-sm">Click "Restart Flight" to begin</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-gray-800 rounded font-medium">SMOOTH FLIGHT</div>
                <span>8-second cinematic zoom from wide view</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-gray-800 rounded font-medium">HIGH-RES</div>
                <span>Satellite imagery with realistic details</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 bg-gray-800 rounded font-medium">CONTROLS</div>
                <span>Restart flight or switch views anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/20 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <Navigation className="w-6 h-6 text-blue-400 animate-pulse" />
              <h4 className="text-xl font-bold text-white">Smooth Drone Flight</h4>
            </div>
            <p className="text-gray-400">
              Experience a buttery-smooth 8-second aerial journey using advanced interpolation 
              from {sourceLocation.lat.toFixed(2)}°N to IIT Guwahati campus with no flickering.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/20 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <Satellite className="w-6 h-6 text-green-400" />
              <h4 className="text-xl font-bold text-white">High-Resolution Satellite</h4>
            </div>
            <p className="text-gray-400">
              Multiple satellite layers provide crystal-clear imagery of the campus, 
              Brahmaputra river, and surrounding landscape with enhanced detail.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-900/60 to-gray-900/20 backdrop-blur-sm rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <ZoomIn className="w-6 h-6 text-cyan-400" />
              <h4 className="text-xl font-bold text-white">Real-time Animation</h4>
            </div>
            <p className="text-gray-400">
              Smooth interpolation with easing functions prevents flickering and provides 
              professional cinematic zoom experience with progress tracking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}