// Copyright 2015-present 650 Industries. All rights reserved.
//
// Contains logic for figuring out how to take care of deep links.

#import "EXLinkingManager.h"
#import "EXReactAppManager.h"
#import "EXUtil.h"

@interface EXKernelLinkingManager : NSObject <EXLinkingManagerScopedModuleDelegate>

/**
 *  Either opens the url on an existing bridge, or sends it to the kernel
 *  for opening on a new bridge.
 */
- (void)openUrl:(NSString *)urlString isUniversalLink:(BOOL)isUniversalLink;

/**
 *  Returns the deep link prefix for a given experience uri.
 */
+ (NSString *)linkingUriForExperienceUri:(NSURL *)uri;

/**
 *  Normalize a uri and (if needed) subtitute
 *  standalone-app-specific deep link formatting.
 */
+ (NSURL *)uriTransformedForLinking:(NSURL *)uri isUniversalLink:(BOOL)isUniversalLink;

+ (NSString *)stringByRemovingDeepLink:(NSString *)path;

# pragma mark - app-wide linking handlers

+ (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)URL
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation;

+ (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray *))restorationHandler;

+ (NSURL *)initialUrlFromLaunchOptions: (NSDictionary *)launchOptions;

@end