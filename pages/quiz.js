import styled from 'styled-components'
import db from '../db.json';
import QuizContainer from '../src/components/QuizContainer'
import Widget from '../src/components/Widget'
import QuizLogo from '../src/components/QuizLogo'
import QuizBackground from '../src/components/QuizBackground'
import Footer from '../src/components/Footer'
import GitHubCorner from '../src/components/GitHubCorner'
import Input from '../src/components/Input'
import Button from '../src/components/Button'
import AlternativesForm from '../src/components/AlternativesForm'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
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
  
  return (
    <Widget>
      <Widget.Header>
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

export default function QuizPage() {
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