import styled from 'styled-components'
import QuizContainer from '../../components/QuizContainer'
import Widget from '../../components/Widget'
import QuizLogo from '../../components/QuizLogo'
import QuizBackground from '../../components/QuizBackground'
import Footer from '../../components/Footer'
import GitHubCorner from '../../components/GitHubCorner'
import Input from '../../components/Input'
import Button from '../../components/Button'
import AlternativesForm from '../../components/AlternativesForm'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import BackLinkArrow from '../../components/BackLinkArrow'

import { Howl } from 'howler'
import { motion } from 'framer-motion'
import PlayButton from '../../components/PlayButton'
import { BsPlay, BsPlayFill} from 'react-icons/bs'

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        Carregando...
      </Widget.Header>

      <Widget.Content>
        <img
          alt="Carregando"
          style={{
            width: '33%',
            margin: '0 33.5%',
          }}
          src='https://i.stack.imgur.com/kOnzy.gif'
        />
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({ question, totalQuestions, questionIndex, onSubmit, addResult, }) {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined)
  const [isQuestionSubmited, setIsQuestionSubmited] = useState(false)
  const questionId = `question_${questionIndex}`
  const isCorrect = selectedAlternative === question.answer
  const hasSelectedAlternative = selectedAlternative !== undefined
  
  const [isPlaying, setIsPlaying] = useState(false);
  const sound = question.sound && 
    new Howl({
      src: question.sound,
      html5: true,
      volume: 0.5,
      autoplay: false,
      preload: true,
      onend: () => {
        setIsPlaying(false);
      }
    })
  
  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>{`Pergunta ${questionIndex + 1} de ${totalQuestions}`}</h3>
      </Widget.Header>
      <img
        alt="Descrição"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>
          {question.title}
        </h2>
        <p>
          {question.description}
        </p>
        {question.sound && 
          <PlayButton 
            onClick={() => {
              if(!isPlaying) {
                sound.play();
                setIsPlaying(true);
              }
            }}
            as={motion.button}
            whileHover={{ 
              scale: 1.1,
              transition: { duration: 0.1}
            }}
            whileTap={{ scale: 1 }}
          >
            {!isPlaying && <BsPlay size={40} />}
            {isPlaying && <BsPlayFill size={40} />}
          </PlayButton>
        }
        <AlternativesForm
          onSubmit={function (e) {
            e.preventDefault();
            setIsQuestionSubmited(true)
            setTimeout(() => {
              addResult(isCorrect)
              onSubmit()
              setIsQuestionSubmited(false)
              setSelectedAlternative(undefined)
            }, 1000 * 1)
          }}
        >
          {question.alternatives.map((alternative, index) => {
            const alternativeId = `alternative_${index}`
            const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR'
            return (
              <Widget.Topic
                as="label"
                key={alternativeId}
                htmlFor={alternativeId}
                data-selected={selectedAlternative === index}
                data-status={isQuestionSubmited && alternativeStatus}
              >
                <input
                  style={{ display: 'none' }}
                  id={alternativeId}
                  name={questionId}
                  type="radio"
                  onChange={() => setSelectedAlternative(index)}
                  checked={false}
                />
                {alternative}
              </Widget.Topic>
            )
          })}
          <Button type="submit" disabled={!hasSelectedAlternative}>
            Confirmar
          </Button>
        </AlternativesForm>
      </Widget.Content>
    </Widget>
  )
}

function ResultWidget({ results }) {
  return (
    <Widget>
      <Widget.Header>
        <BackLinkArrow href="/" />
        <h3>Fim de Jogo</h3>
      </Widget.Header>
      <Widget.Content>
        <p>{console.log("results:", results)}</p>
        <p>
          Você fez 
          {' '}
          {results.reduce((sum, result) => {
            if(result) {
              sum += 10
            }
            return sum
          }, 0)}
          {' '}
          pontos
        </p>
        <ul>
          {results.map((result, index) => (
            <li key={`result_${index}`}>
              {`Questão #${index + 1}: ${result ? 'Acertou' : 'Errou'}`}
            </li>
          ))}
        </ul>
      </Widget.Content>
    </Widget>  
  )
}

const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
}

export default function QuizScreen({ db }) {
  const [screenState, setScreenState] = useState(screenStates.LOADING)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [results, setResults] = useState([])
  const question = db.questions[questionIndex]
  const totalQuestions = db.questions.length
  
  function addResult(result) {
    setResults([
      ...results,
      result,
    ])
  }
  
  useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ)
    }, 1000 * 1)
  }, [])

  return (
    <QuizBackground backgroundImage={db.bg}>
      <Head>
        <title>AluraQuiz</title>
      </Head>
      <QuizContainer>
        <QuizLogo />
        
        {screenState === screenStates.QUIZ && (
          <QuestionWidget 
            question={question}
            questionIndex={questionIndex}
            totalQuestions={totalQuestions}
            onSubmit={() => questionIndex + 1 < totalQuestions ? setQuestionIndex(questionIndex + 1) : setScreenState(screenStates.RESULT)}
            addResult={addResult}
          />
        )}
        
        {screenState === screenStates.LOADING && <LoadingWidget />}
        
        {screenState === screenStates.RESULT && <ResultWidget results={results} /> }
        
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/marcelocell/imersao-react-nextjs" />
    </QuizBackground>
  );
}