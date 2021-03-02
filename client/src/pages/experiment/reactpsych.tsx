import { Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'
import React from 'react'
import Layout from '../../components/Layout/Layout'
import { NextChakraImage } from '../../components/NextChakraImage'
import { TrialInput, usePostTrialMutation } from '../../generated/graphql'
import {
  createQuestionList,
  SelectImage,
  TextScreen,
  Timeline,
} from '../../react-psych'
import { BeginScreen } from '../../react-psych/components/BeginScreen'
import { defaultUserResponse } from '../../react-psych/types'
import { createUrqlClient } from '../../utils/createUrqlClient'
import ReactPlayer from 'react-player/lazy'

const questionList = createQuestionList(
  '/react-psych/DRT',
  10,
  [4, 3, 2, 2, 2, 1, 4, 3, 4, 2],
  4
)

const ReactPsych: React.FC = () => {
  const router = useRouter()
  const [, post] = usePostTrialMutation()

  const finish = async (responses: defaultUserResponse[]): Promise<void> => {
    const data: TrialInput = {
      experiment: 'DRT',
      responses,
    }

    const res = await post({ data })

    if (res.data?.postTrial.success) {
      console.log('successfully sent trial')
    } else {
      console.log(`failed to send trial: ${res.data?.postTrial.errors}`)
    }

    router.push('/')
  }

  // useEffect(() => {
  //   cacheImages(['/exp/drt/danny.png'])
  // }, [])

  return (
    <Layout>
      <Flex align="center" justify="center">
        <Flex shadow="md" align="center" justify="center" my={5}>
          <Timeline onFinish={finish} size="100">
            <BeginScreen buttonText="Next">
              <VStack spacing={4} mx={10} mb={5} textAlign="center">
                <Heading fontSize="70px">
                  Diagrammatic Representations Test
                </Heading>
                <Text px={60} mb={6}></Text>
              </VStack>
            </BeginScreen>
            <TextScreen buttonText="Next">
              <VStack spacing={8} mx={10} mb={10} textAlign="center">
                <Heading fontSize="60px">Audio Test</Heading>
                <Text px={60} fontSize="25px">
                  Please click the play button below and ensure you can hear the
                  audio clip, then click Next.
                </Text>
                <ReactPlayer
                  url="/react-psych/DRT/instructions/audio_test.mp3"
                  height="50px"
                  controls={true}
                />
              </VStack>
            </TextScreen>
            <TextScreen buttonText="Begin">
              <VStack px={20} spacing={2} textAlign="center">
                <ReactPlayer
                  url="/react-psych/DRT/instructions/DRT_instructions.mp4"
                  controls={true}
                  width="80%"
                  height="80%"
                />
              </VStack>
            </TextScreen>
            <TextScreen buttonText="Next">
              <VStack px={20} spacing={4} textAlign="center">
                <ReactPlayer
                  url="/react-psych/DRT/instructions/DRT_demo.mp4"
                  controls={true}
                  width="80%"
                  height="80%"
                />
              </VStack>
            </TextScreen>
            {questionList.map((q, idx) => {
              return <SelectImage key={idx} {...q} />
            })}
            <TextScreen buttonText="Finish">
              <Heading fontSize="70px">Done!</Heading>
              <Text mb={4} fontSize="25px">
                Click below to return to the home page.
              </Text>
            </TextScreen>
          </Timeline>
        </Flex>
      </Flex>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(ReactPsych)
