{"version":3,"names":["_gensync","data","require","_async","_util","context","_plugin","_item","_configChain","_deepArray","_travers
e","_caching","_options","_plugins","_configApi","_partial","_configError","_default","exports","default","gensync","loadFullConfig","inputOpts","_opts$assumptions","result","loadPrivatePartialConfig","options","fileHandling","optionDefaults","plugins","presets","Error","presetContext","Object","assign","targets","toDescriptor","item","desc","getItemDescriptor","presetsDescriptors","map","initialPluginsDescriptors","pluginDescriptorsByPass","passes","externalDependencies","ignored","enhanceError","recursePresetDescriptors","rawPresets","pluginDescriptorsPass","i","length","descriptor","preset","loadPresetDescriptor","e","code","checkNoUnwrappedItemOptionPairs","push","ownPass","chain","pass","unshift","splice","o","filter","p","forEach","opts","mergeOptions","pluginContext","assumptions","loadPluginDescriptors","descs","plugin","loadPluginDescriptor","slice","passPerPreset","freezeDeepArray","fn","arg1","arg2","test","message","_context$filename","filename","makeDescriptorLoader","apiFactory","makeWeakCache","value","dirname","alias","cache","factory","maybeAsync","api","JSON","stringify","isThenable","configured","mode","error","pluginDescriptorLoader",
"makePluginAPI","presetDescriptorLoader","makePresetAPI","instantiatePlugin","pluginObj","validatePluginObject","visitor","traverse","explode","inherits",
"inheritsDescriptor","name","undefined","forwardAsync","run","invalidate","pre","chainMaybeAsync","post","manipulateOptions","visitors","merge","Plugin","needsFilename"
,"val","validateIfOptionNeedsFilename","include","exclude","formattedPresetName","ConfigError","join","validatePreset","_options$overrides","overrides","overrideOptions",
"instantiatePreset","makeWeakCacheSync","validate","buildPresetChain","a","b","args","res","apply","then"],"sources":["../../src/config/full.ts"],"sourcesContent":["import gensync, 
{ type Handler } from \"gensync\";\nimport {\n  forwardAsync,\n  maybeAsync,\n  isThenable,\n} from \"../gensync-utils/async.ts\";\n\nimport { mergeOptions } from \"./util.ts\";\nimport 
* as context from \"../index.ts\";\nimport Plugin from \"./plugin.ts\";\nimport { getItemDescriptor } from \"./item.ts\";\nimport { buildPresetChain } from \"./config-chain.ts\";\nimport
{ finalize as freezeDeepArray } from \"./helpers/deep-array.ts\";\nimport type { DeepArray, ReadonlyDeepArray } from \"./helpers/deep-array.ts\";\nimport type {\n  ConfigContext,\n  ConfigChain,
\n  PresetInstance,\n} from \"./config-chain.ts\";\nimport type { UnloadedDescriptor } from \"./config-descriptors.ts\";\nimport traverse from \"@babel/traverse\";\nimport { makeWeakCache,
makeWeakCacheSync } from \"./caching.ts\";\nimport type { CacheConfigurator } from \"./caching.ts\";\nimport {\n  validate,\n  checkNoUnwrappedItemOptionPairs,\n} from \"./validation/options.
ts\";\nimport type { InputOptions, PluginItem } from \"./validation/options.ts\";\nimport { validatePluginObject } from \"./validation/plugins.ts\";\nimport { makePluginAPI, makePresetAPI }
from \"./helpers/config-api.ts\";\nimport type { PluginAPI, PresetAPI } from \"./helpers/config-api.ts\";\n\nimport loadPrivatePartialConfig from \"./partial.ts\";\nimport type { ValidatedOptions }
from \"./validation/options.ts\";\n\nimport type * as Context from \"./cache-contexts.ts\";\nimport ConfigError from \"../errors/config-error.ts\";\n\ntype LoadedDescriptor = {\n  value: any;\n  options:
object;\n  dirname: string;\n  alias: string;\n  externalDependencies: ReadonlyDeepArray<string>;\n};\n\nexport type { InputOptions } from \"./validation/options.ts\";\n\nexport type ResolvedConfig = {\n 
options: any;\n  passes: PluginPasses;\n  externalDependencies: ReadonlyDeepArray<string>;\n};\n\nexport type { Plugin };\nexport type PluginPassList = Array<Plugin>;\nexport type PluginPasses =
Array<PluginPassList>;\n\nexport default gensync(function* loadFullConfig(\n  inputOpts: InputOptions,\n): Handler<ResolvedConfig | null> {\n  const result = yield* loadPrivatePartialConfig(inputOpts);\n
if (!result) {\n    return null;\n  }\n  const { options, context, fileHandling } = result;\n\n  if (fileHandling === \"ignored\") {\n    return null;\n  }\n\n  const optionDefaults: ValidatedOptions
= {};\n\n  const { plugins, presets } = options;\n\n  if (!plugins || !presets) {\n    throw new Error(\"Assertion failure - plugins and presets exist\");\n  }\n\n  const presetContext: Context.FullPreset
= {\n    ...context,\n    targets: options.targets,\n  };\n\n  const toDescriptor = (item: PluginItem) => {\n    const desc = getItemDescriptor(item);\n    if (!desc) {\n      throw new Error(\"Assertion 
failure - must be config item\");\n    }\n\n    return desc;\n  };\n\n  const presetsDescriptors = presets.map(toDescriptor);\n  const initialPluginsDescriptors = plugins.map(toDescriptor);\n 
const pluginDescriptorsByPass: Array<Array<UnloadedDescriptor<PluginAPI>>> = [\n    [],\n  ];\n  const passes: Array<Array<Plugin>> = [];\n\n  const externalDependencies: DeepArray<string> =
[];\n\n  const ignored = yield* enhanceError(\n    context,\n    function* recursePresetDescriptors(\n      rawPresets: Array<UnloadedDescriptor<PresetAPI>>,\n   
pluginDescriptorsPass: Array<UnloadedDescriptor<PluginAPI>>,\n    ): Handler<true | void> {\n      const presets: Array<{\n        preset: ConfigChain | null;\n     
pass: Array<UnloadedDescriptor<PluginAPI>>;\n      }> = [];\n\n      for (let i = 0; i < rawPresets.length; i++) {\n        const descriptor = rawPresets[i];\n      
if (descriptor.options !== false) {\n          try {\n            // eslint-disable-next-line no-var\n            var preset = yield* loadPresetDescriptor(descriptor, presetContext);\n  
} catch (e) {\n            if (e.code === \"BABEL_UNKNOWN_OPTION\") {\n              checkNoUnwrappedItemOptionPairs(rawPresets, i, \"preset\", e);\n            }\n           
throw e;\n          }\n\n          externalDependencies.push(preset.externalDependencies);\n\n          // Presets normally run in reverse order, but if they\n        
// have their own pass they run after the presets\n          // in the previous pass.\n          if (descriptor.ownPass) {\n            presets.push({ preset: preset.chain, pass: [] });\n   
} else {\n            presets.unshift({\n              preset: preset.chain,\n              pass: pluginDescriptorsPass,\n            });\n          }\n        }\n      }\n\n     
// resolve presets\n      if (presets.length > 0) {\n        // The passes are created in the same order as the preset list, but are inserted before any\n        // existing additional passes.\n        pluginDescriptorsByPass.splice(\n          1,\n          0,\n          ...presets.map(o => o.pass).filter(p => p !== pluginDescriptorsPass),\n        );\n\n        for (const { preset, pass } of presets) {\n          if (!preset) return true;\n\n          pass.push(...preset.plugins);\n\n          const ignored = yield* recursePresetDescriptors(preset.presets, pass);\n          if (ignored) return true;\n\n          preset.options.forEach(opts => {\n            mergeOptions(optionDefaults, opts);\n          });\n        }\n      }\n    },\n  )(presetsDescriptors, pluginDescriptorsByPass[0]);\n\n  if (ignored) return null;\n\n  const opts: ValidatedOptions = optionDefaults;\n  mergeOptions(opts, options);\n\n  const pluginContext: Context.FullPlugin = {\n    ...presetContext,\n    assumptions: opts.assumptions ?? {},\n  };\n\n  yield* enhanceError(context, function* loadPluginDescriptors() {\n    pluginDescriptorsByPass[0].unshift(...initialPluginsDescriptors);\n\n    for (const descs of pluginDescriptorsByPass) {\n      const pass: Plugin[] = [];\n      passes.push(pass);\n\n      for (let i = 0; i < descs.length; i++) {\n        const descriptor = descs[i];\n        if (descriptor.options !== false) {\n          try {\n            // eslint-disable-next-line no-var\n            var plugin = yield* loadPluginDescriptor(descriptor, pluginContext);\n          } catch (e) {\n            if (e.code === \"BABEL_UNKNOWN_PLUGIN_PROPERTY\") {\n              // print special message for `plugins: [\"@babel/foo\", { foo: \"option\" }]`\n              checkNoUnwrappedItemOptionPairs(descs, i, \"plugin\", e);\n            }\n            throw e;\n          }\n          pass.push(plugin);\n\n          externalDependencies.push(plugin.externalDependencies);\n        }\n      }\n    }\n  })();\n\n  opts.plugins = passes[0];\n  opts.presets = passes\n    .slice(1)\n    .filter(plugins => plugins.length > 0)\n    .map(plugins => ({ plugins }));\n  opts.passPerPreset = opts.presets.length > 0;\n\n  return {\n    options: opts,\n    passes: passes,\n    externalDependencies: freezeDeepArray(externalDependencies),\n  };\n});\n\nfunction enhanceError<T extends Function>(context: ConfigContext, fn: T): T {\n  return function* (arg1: unknown, arg2: unknown) {\n    try {\n      return yield* fn(arg1, arg2);\n    } catch (e) {\n      // There are a few case where thrown errors will try to annotate themselves multiple times, so\n      // to keep things simple we just bail out if re-wrapping the message.\n      if (!/^\\[BABEL\\]/.test(e.message)) {\n        e.message = `[BABEL] ${context.filename ?? \"unknown file\"}: ${\n          e.message\n        }`;\n      }\n\n      throw e;\n    }\n  } as any;\n}\n\n/**\n * Load a generic plugin/preset from the given descriptor loaded from the config object.\n */\nconst makeDescriptorLoader = <Context, API>(\n  apiFactory: (\n    cache: CacheConfigurator<Context>,\n    externalDependencies: Array<string>,\n  ) => API,\n) =>\n  makeWeakCache(function* (\n    { value, options, dirname, alias }: UnloadedDescriptor<API>,\n    cache: CacheConfigurator<Context>,\n  ): Handler<LoadedDescriptor> {\n    // Disabled presets should already have been filtered out\n    if (options === false) throw new Error(\"Assertion failure\");\n\n    options = options || {};\n\n    const externalDependencies: Array<string> = [];\n\n    let item: unknown = value;\n    if (typeof value === \"function\") {\n      const factory = maybeAsync(\n        value as (api: API, options: object, dirname: string) => unknown,\n        `You appear to be using an async plugin/preset, but Babel has been called synchronously`,\n      );\n\n      const api = {\n        ...context,\n        ...apiFactory(cache, externalDependencies),\n      };\n      try {\n        item = yield* factory(api, options, dirname);\n      } catch (e) {\n        if (alias) {\n          e.message += ` (While processing: ${JSON.stringify(alias)})`;\n        }\n        throw e;\n      }\n    }\n\n    if (!item || typeof item !== \"object\") {\n      throw new Error(\"Plugin/Preset did not return an object.\");\n    }\n\n    if (isThenable(item)) {\n      // if we want to support async plugins\n      yield* [];\n\n      throw new Error(\n        `You appear to be using a promise as a plugin, ` +\n          `which your current version of Babel does not support. ` +\n          `If you're using a published plugin, ` +\n          `you may need to upgrade your @babel/core version. ` +\n          `As an alternative, you can prefix the promise with \"await\". ` +\n          `(While processing: ${JSON.stringify(alias)})`,\n      );\n    }\n\n    if (\n      externalDependencies.length > 0 &&\n      (!cache.configured() || cache.mode() === \"forever\")\n    ) {\n      let error =\n        `A plugin/preset has external untracked dependencies ` +\n        `(${externalDependencies[0]}), but the cache `;\n      if (!cache.configured()) {\n        error += `has not been configured to be invalidated when the external dependencies change. `;\n      } else {\n        error += ` has been configured to never be invalidated. `;\n      }\n      error +=\n        `Plugins/presets should configure their cache to be invalidated when the external ` +\n        `dependencies change, for example using \\`api.cache.invalidate(() => ` +\n        `statSync(filepath).mtimeMs)\\` or \\`api.cache.never()\\`\\n` +\n        `(While processing: ${JSON.stringify(alias)})`;\n\n      throw new Error(error);\n    }\n\n    return {\n      value: item,\n      options,\n      dirname,\n      alias,\n      externalDependencies: freezeDeepArray(externalDependencies),\n    };\n  });\n\nconst pluginDescriptorLoader = makeDescriptorLoader<\n  Context.SimplePlugin,\n  PluginAPI\n>(makePluginAPI);\nconst presetDescriptorLoader = makeDescriptorLoader<\n  Context.SimplePreset,\n  PresetAPI\n>(makePresetAPI);\n\nconst instantiatePlugin = makeWeakCache(function* (\n  { value, options, dirname, alias, externalDependencies }: LoadedDescriptor,\n  cache: CacheConfigurator<Context.SimplePlugin>,\n): Handler<Plugin> {\n  const pluginObj = validatePluginObject(value);\n\n  const plugin = {\n    ...pluginObj,\n  };\n  if (plugin.visitor) {\n    plugin.visitor = traverse.explode({\n      ...plugin.visitor,\n    });\n  }\n\n  if (plugin.inherits) {\n    const inheritsDescriptor: UnloadedDescriptor<PluginAPI> = {\n      name: undefined,\n      alias: `${alias}$inherits`,\n      value: plugin.inherits,\n      options,\n      dirname,\n    };\n\n    const inherits = yield* forwardAsync(loadPluginDescriptor, run => {\n      // If the inherited plugin changes, reinstantiate this plugin.\n      return cache.invalidate(data => run(inheritsDescriptor, data));\n    });\n\n    plugin.pre = chainMaybeAsync(inherits.pre, plugin.pre);\n    plugin.post = chainMaybeAsync(inherits.post, plugin.post);\n    plugin.manipulateOptions = chainMaybeAsync(\n      inherits.manipulateOptions,\n      plugin.manipulateOptions,\n    );\n    plugin.visitor = traverse.visitors.merge([\n      inherits.visitor || {},\n      plugin.visitor || {},\n    ]);\n\n    if (inherits.externalDependencies.length > 0) {\n      if (externalDependencies.length === 0) {\n        externalDependencies = inherits.externalDependencies;\n      } else {\n        externalDependencies = freezeDeepArray([\n          externalDependencies,\n          inherits.externalDependencies,\n        ]);\n      }\n    }\n  }\n\n  return new Plugin(plugin, options, alias, externalDependencies);\n});\n\n/**\n * Instantiate a plugin for the given descriptor, returning the plugin/options pair.\n */\nfunction* loadPluginDescriptor(\n  descriptor: UnloadedDescriptor<PluginAPI>,\n  context: Context.SimplePlugin,\n): Handler<Plugin> {\n  if (descriptor.value instanceof Plugin) {\n    if (descriptor.options) {\n      throw new Error(\n        \"Passed options to an existing Plugin instance will not work.\",\n      );\n    }\n\n    return descriptor.value;\n  }\n\n  return yield* instantiatePlugin(\n    yield* pluginDescriptorLoader(descriptor, context),\n    context,\n  );\n}\n\nconst needsFilename = (val: unknown) => val && typeof val !== \"function\";\n\nconst validateIfOptionNeedsFilename = (\n  options: ValidatedOptions,\n  descriptor: UnloadedDescriptor<PresetAPI>,\n): void => {\n  if (\n    needsFilename(options.test) ||\n    needsFilename(options.include) ||\n    needsFilename(options.exclude)\n  ) {\n    const formattedPresetName = descriptor.name\n      ? `\"${descriptor.name}\"`\n      : \"/* your preset */\";\n    throw new ConfigError(\n      [\n        `Preset ${formattedPresetName} requires a filename to be set when babel is called directly,`,\n        `\\`\\`\\``,\n        `babel.transformSync(code, { filename: 'file.ts', presets: [${formattedPresetName}] });`,\n        `\\`\\`\\``,\n        `See https://babeljs.io/docs/en/options#filename for more information.`,\n      ].join(\"\\n\"),\n    );\n  }\n};\n\nconst validatePreset = (\n  preset: PresetInstance,\n  context: ConfigContext,\n  descriptor: UnloadedDescriptor<PresetAPI>,\n): void => {\n  if (!context.filename) {\n    const { options } = preset;\n    validateIfOptionNeedsFilename(options, descriptor);\n    options.overrides?.forEach(overrideOptions =>\n      validateIfOptionNeedsFilename(overrideOptions, descriptor),\n    );\n  }\n};\n\nconst instantiatePreset = makeWeakCacheSync(\n  ({\n    value,\n    dirname,\n    alias,\n    externalDependencies,\n  }: LoadedDescriptor): PresetInstance => {\n    return {\n      options: validate(\"preset\", value),\n      alias,\n      dirname,\n      externalDependencies,\n    };\n  },\n);\n\n/**\n * Generate a config object that will act as the root of a new nested config.\n */\nfunction* loadPresetDescriptor(\n  descriptor: UnloadedDescriptor<PresetAPI>,\n  context: Context.FullPreset,\n): Handler<{\n  chain: ConfigChain | null;\n  externalDependencies: ReadonlyDeepArray<string>;\n}> {\n  const preset = instantiatePreset(\n    yield* presetDescriptorLoader(descriptor, context),\n  );\n  validatePreset(preset, context, descriptor);\n  return {\n    chain: yield* buildPresetChain(preset, context),\n    externalDependencies: preset.externalDependencies,\n  };\n}\n\nfunction chainMaybeAsync<Args extends any[], R extends void | Promise<void>>(\n  a: undefined | ((...args: Args) => R),\n  b: undefined | ((...args: Args) => R),\n): (...args: Args) => R {\n  if (!a) return b;\n  if (!b) return a;\n\n  return function (this: unknown, ...args: Args) {\n    const res = a.apply(this, args);\n    if (res && typeof res.then === \"function\") {\n      return res.then(() => b.apply(this, args));\n    }\n    return b.apply(this, args);\n  } as (...args: Args) => R;\n}\n"],"mappings":"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","ignoreList":[]}
