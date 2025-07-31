// src/app/api/produtos/get/route.js
import { NextResponse } from 'next/server';

const produtos = [
  {
    id: 1,
    key: 'a2423dsfsd',
    name: "Inventory System",
    price: 150,
    image: "https://i.imgur.com/MXqeK9U.png",
    video: "https://www.youtube.com/watch?v=iKS2ROcv1P0",
    description: "Sistema de inventário completo para MTA",
    createdAt: "2023-09-01",
    updatedAt: "2023-09-15",
  },
  {
    id: 2,
    key: 'a2423dsfsd',
    name: "Login System",
    price: 100,
    image: "https://i.imgur.com/MXqeK9U.png",
    description: "Tela de login com animações e integração com banco",
    createdAt: "2023-09-10",
    updatedAt: "2023-09-18",
  },
  {
    id: 3,
    key: 'a2423dsfsd',
    name: "Character System",
    price: 200,
    image: "https://i.imgur.com/MXqeK9U.png",
    description: "Descrição do produto 1",
    createdAt: "2023-10-01",
    updatedAt: "2023-10-01",
  },
  {
    id: 4,
    key: 'a2423dsfsd',
    name: "Ban System",
    price: 80,
    image: "https://i.imgur.com/MXqeK9U.png",
    description: "Sistema de banimento com painel e logs",
    createdAt: "2023-08-20",
    updatedAt: "2023-08-30",
  }
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function GET() {
  return new NextResponse(JSON.stringify(produtos), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}