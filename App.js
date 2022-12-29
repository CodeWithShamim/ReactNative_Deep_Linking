import { View, Text, TouchableOpacity, Share } from 'react-native'
import React, { useEffect } from 'react'
import dynamicLinks from '@react-native-firebase/dynamic-links';

const App = () => {

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        handleDynamicLink(link);
      })

    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe();
  }, [])

  const handleDynamicLink = link => {
    console.log("Response link", link);
  };

  const handleGenerateLink = async (id) => {
    try {
      const link = await dynamicLinks().buildShortLink({
        link: `https://deeplinkingtest100.page.link/V9Hh?id=${id}`,
        domainUriPrefix: 'https://deeplinkingtest100.page.link',
        android: {
          packageName: "com.reactnative_deep_linking",
          minimumVersion: "20",
        },
        // ios: {
        //   appStoreId: "0000",
        //   bundleId: "0000",
        //   minimumVersion: "20",
        // },
        analytics: {
          campaign: 'banner',
        }
      }
      )

      return link
    } catch (error) {
      alert(error.message);
    }
  };

  const handleShare = async (id) => {
    const url = await handleGenerateLink(id)

    console.log("Link ....", url);
    try {
      const result = await Share.share({
        message: 'Test Deep Linking.',
        url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>

      {[...new Array(15)].map((_, index) => {
        return <TouchableOpacity onPress={() => handleShare(index)}>
          <Text
            style={{
              marginVertical: 10,
              backgroundColor: "red",
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
              borderRadius: 10,
              paddingHorizontal: 100,
            }}>
            {index}
          </Text>
        </TouchableOpacity>
      })}
    </View>
  )
}

export default App