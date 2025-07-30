import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react'
import en from '../../public/locales/en'
import vi from '../../public/locales/vi'

type Locale = 'en' | 'vi'

interface LocaleContextType {
	locale: Locale
	setLocale: (locale: Locale) => void
	t: (key: string, params?: Record<string, string | number>) => string
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [locale, setLocale] = useState<Locale>('en')
	const [isHydrated, setIsHydrated] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const savedLocale = localStorage.getItem('locale') as Locale
			if (savedLocale === 'en' || savedLocale === 'vi') {
				setLocale(savedLocale)
			}
			setIsHydrated(true)
		}
	}, [])

	// Save locale preference to localStorage when it changes
	useEffect(() => {
		if (typeof window !== 'undefined' && isHydrated) {
			localStorage.setItem('locale', locale)
		}
	}, [locale, isHydrated])

	// Translations object based on current locale
	const translations = locale === 'en' ? en : vi

	// Translation function
	const t = (key: string, params?: Record<string, string | number>): string => {
		const translation = translations[key] || key

		if (!params) return translation

		// Replace parameters in the format {{variable}} or {0}, {1}, etc.
		return Object.entries(params).reduce((result, [paramKey, paramValue]) => {
			// Handle both {{variable}} and {variable} formats
			return result
				.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g'), String(paramValue))
				.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue))
		}, translation)
	}

	return (
		<LocaleContext.Provider value={{ locale, setLocale, t }}>
			{children}
		</LocaleContext.Provider>
	)
}

// Custom hook to use the locale context
export const useLocale = (): LocaleContextType => {
	const context = useContext(LocaleContext)

	if (context === undefined) {
		throw new Error('useLocale must be used within a LocaleProvider')
	}

	return context
}
