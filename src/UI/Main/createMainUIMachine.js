import { Machine, assign } from 'xstate'

const assignInterpolationEnabled = assign({
  main: (context, event) => {
    const main = context.main
    main.interpolationEnabled = !main.interpolationEnabled
    return main
  },
})

const assignFullscreenEnabled = assign({
  main: (context, event) => {
    const main = context.main
    main.fullscreenEnabled = !main.fullscreenEnabled
    return main
  },
})

const assignAnnotationsEnabled = assign({
  main: (context, event) => {
    const main = context.main
    main.annotationsEnabled = !main.annotationsEnabled
    return main
  },
})

const assignRotateEnabled = assign({
  main: (context, event) => {
    const main = context.main
    main.rotateEnabled = !main.rotateEnabled
    return main
  },
})

const assignAxesEnabled = assign({
  main: (context, event) => {
    const main = context.main
    main.axesEnabled = !main.axesEnabled
    return main
  },
})

const assignViewMode = assign({
  main: (context, event) => {
    const main = context.main
    main.viewMode = event.data
    return main
  },
})

function createMainUIMachine(options, context) {
  let initialViewMode = 'volumeRendering'
  switch (context.main.viewMode) {
    case 'XPlane':
      initialViewMode = 'xPlane'
      break
    case 'YPlane':
      initialViewMode = 'yPlane'
      break
    case 'ZPlane':
      initialViewMode = 'zPlane'
      break
    case 'VolumeRendering':
      initialViewMode = 'volumeRendering'
      break
    default:
      throw new Error(`Invalid initial view mode: ${context.main.viewMode}`)
  }

  return Machine(
    {
      id: 'main',
      initial: 'idle',
      context,
      states: {
        idle: {
          always: {
            target: 'active',
            actions: ['createMainInterface'],
          },
        },
        active: {
          type: 'parallel',
          on: {
            TOGGLE_BACKGROUND_COLOR: {
              actions: 'toggleBackgroundColor',
            },
          },
          states: {
            fullscreen: {
              initial: context.fullscreenEnabled ? 'enabled' : 'disabled',
              states: {
                enabled: {
                  exit: 'toggleFullscreen',
                  on: {
                    TOGGLE_FULLSCREEN: {
                      target: 'disabled',
                      actions: assignFullscreenEnabled,
                    },
                    DISABLE_FULLSCREEN: {
                      target: 'disabled',
                      actions: assignFullscreenEnabled,
                    },
                  },
                },
                disabled: {
                  exit: 'toggleFullscreen',
                  on: {
                    TOGGLE_FULLSCREEN: {
                      target: 'enabled',
                      actions: assignFullscreenEnabled,
                    },
                  },
                },
              },
            },
            annotations: {
              initial: context.annotationsEnabled ? 'enabled' : 'disabled',
              states: {
                enabled: {
                  entry: 'toggleAnnotations',
                  on: {
                    TOGGLE_ANNOTATIONS: {
                      target: 'disabled',
                      actions: assignAnnotationsEnabled,
                    },
                  },
                },
                disabled: {
                  entry: 'toggleAnnotations',
                  on: {
                    TOGGLE_ANNOTATIONS: {
                      target: 'enabled',
                      actions: assignAnnotationsEnabled,
                    },
                  },
                },
              },
            },
            rotate: {
              initial: context.rotateEnabled ? 'enabled' : 'disabled',
              states: {
                enabled: {
                  entry: 'toggleRotate',
                  on: {
                    TOGGLE_ROTATE: {
                      target: 'disabled',
                      actions: assignRotateEnabled,
                    },
                  },
                },
                disabled: {
                  entry: 'toggleRotate',
                  on: {
                    TOGGLE_ROTATE: {
                      target: 'enabled',
                      actions: assignRotateEnabled,
                    },
                  },
                },
              },
            },
            axes: {
              initial: context.axesEnabled ? 'enabled' : 'disabled',
              states: {
                enabled: {
                  entry: 'toggleAxes',
                  on: {
                    TOGGLE_AXES: {
                      target: 'disabled',
                      actions: assignAxesEnabled,
                    },
                  },
                },
                disabled: {
                  entry: 'toggleAxes',
                  on: {
                    TOGGLE_AXES: {
                      target: 'enabled',
                      actions: assignAxesEnabled,
                    },
                  },
                },
              },
            },
            interpolation: {
              initial: context.interpolationEnabled ? 'enabled' : 'disabled',
              states: {
                enabled: {
                  entry: 'toggleInterpolation',
                  on: {
                    TOGGLE_INTERPOLATION: {
                      target: 'disabled',
                      actions: assignInterpolationEnabled,
                    },
                  },
                },
                disabled: {
                  entry: 'toggleInterpolation',
                  on: {
                    TOGGLE_INTERPOLATION: {
                      target: 'enabled',
                      actions: assignInterpolationEnabled,
                    },
                  },
                },
              },
            },
            viewMode: {
              initial: initialViewMode,
              states: {
                xPlane: {
                  entry: 'viewModeXPlane',
                },
                yPlane: {
                  entry: 'viewModeYPlane',
                },
                zPlane: {
                  entry: 'viewModeZPlane',
                },
                volumeRendering: {
                  entry: 'viewModeVolumeRendering',
                },
              },
              on: {
                VIEW_MODE_CHANGED: [
                  {
                    target: '.xPlane',
                    cond: (c, e) => e.data === 'XPlane',
                    actions: assignViewMode,
                  },
                  {
                    target: '.yPlane',
                    cond: (c, e) => e.data === 'YPlane',
                    actions: assignViewMode,
                  },
                  {
                    target: '.zPlane',
                    cond: (c, e) => e.data === 'ZPlane',
                    actions: assignViewMode,
                  },
                  {
                    target: '.volumeRendering',
                    cond: (c, e) => e.data === 'VolumeRendering',
                    actions: assignViewMode,
                  },
                ],
              },
            },
          },
        },
      },
    },
    options
  )
}

export default createMainUIMachine
