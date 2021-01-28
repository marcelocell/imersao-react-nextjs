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

function QuestionWidget({ question, totalQuestions, questionIndex, onSubmit }) {
  const questionId = `question_${questionIndex}`
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
        <form onSubmit={function (e) {
          e.preventDefault();
          onSubmit()
        }}
        >
          {question.alternatives.map((alternative, index) => {
            const alternativeId = `alternative_${index}`
            return (
              <Widget.Topic
                as="label"
                htmlFor={alternativeId}
              >
                <input
                  id={alternativeId}
                  name={questionId}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            )
          })}
          <Button type="submit">
            Confirmar
          </Button>
        </form>
      </Widget.Content>
    </Widget>
  )
}

function ResultWidget() {
  return (
    <Widget>
      <Widget.Header>
        <h3>Fim de Jogo</h3>
      </Widget.Header>
      <Widget.Content>
        [TODO]
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
  const question = db.questions[questionIndex]
  const totalQuestions = db.questions.length
  
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
          />
        )}
        
        {screenState === screenStates.LOADING && <LoadingWidget />}
        
        {screenState === screenStates.RESULT && <ResultWidget /> }
        
        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/marcelocell/imersao-react-nextjs" />
    </QuizBackground>
  );
}