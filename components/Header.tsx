'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { Menu, Coins, Leaf, Search, Bell, ChevronDown, LogIn, LogOut } from "lucide-react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

import { Badge } from "./ui/badge"
import {Web3Auth} from "@web3auth/modal"

import { CHAIN_NAMESPACES, ChainNamespaceType, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base"
import {EthereumPrivateKeyProvider} from '@web3auth/ethereum-provider'
import { createUser } from "@/utils/db/actions"
//import {useMediaQuery} from '@uidotdev/usehooks'

const clientId = process.env.WEB3_AUTH_CLIENT_ID

const chainConfig = {
    CHAIN_NAMESPACES:CHAIN_NAMESPACES.EIP155,
    chainId:'0xaa36a7',
    rpcTarget: 'https://rpc.ankr.com/eth_sepolia',
    displayName: 'Sepolia Testnet',
    blockExplorerUrl: 'https:sepolia.etherscan.io',
    ticker: 'ETH',
    tickerName: 'Ethereum',
    logo:'https://assets.web3auth.io/evm-chains/sepolia.png',
}

const privateKeyProvider = new EthereumPrivateKeyProvider({
    config:chainConfig
})
const web3Auth = new Web3Auth({
    clientId,
    web3AuthNetwork:WEB3AUTH_NETWORK.TESTNET,
    privateKeyProvider
})

interface HeaderProps {
    onMenuClick: () => void,
    totalEarnings: number,
}

export default function Header({ onMenuClick, totalEarnings}: HeaderProps){

    const [provider, setProvider] = useState<IProvider | null>(null)
    const [loggedIn, setLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)
    const [userInfo, setUserInfo] = useState<any>(null)
    const pathname = usePathname()
    const [notification, setNotification] = useState<Notification[]>([])
    const [ balance, setBalance] = useState(0)

    useEffect(()=>{
        const init = async () => {
            try {
                await web3Auth.initModal()
                setProvider(web3Auth.provider)

                if(web3Auth.connected) {
                    setLoggedIn(true)
                    const user = await web3Auth.getUserInfo()
                    setUserInfo(user)
                    if(user.email){
                        localStorage.setItem('usereEmail', user.email)
                        try{
                            await createUser(user.email, user.name || 'Anonymous user')
                        }catch(error) {
                            console.log("Error creating user", error);
                        }
                    }
                }
            } catch (error) {
                console.error('Error initializing web3auth', error);
            } finally {
                setLoading(false)
            }
        }
        init()
    },[]);

    useEffect(()=> {
        const fetchNotifications = async () => {
            if(userInfo && userInfo.email){
                const user = await getUserByEmail(userInfo.email)
            }
        }
    }) 
}