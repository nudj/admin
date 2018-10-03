source /root/.zsh/zsh-autosuggestions/zsh-autosuggestions.zsh
export PATH=$PATH:/usr/src/node_modules/.bin

PROMPT='admin» '

alias run="yarn start"
alias dev="yarn run dev"
alias test="standard && flow && mocha --recursive test/unit"
alias tdd='nodemon \
	--config ./nodemon-tdd.json \
	--quiet \
	--watch ./ \
	--delay 250ms \
	-x "standard && mocha --recursive test/unit || exit 1"'
alias flow='flow --quiet'

alias fdd='nodemon \
	--config ./nodemon-tdd.json \
	--quiet \
	--watch ./ \
	--delay 250ms \
	-x "flow --quiet || exit 1"'

yank () {
  for package in "$@"; do
    cd /usr/src/yank/$package && yarn link && cd /usr/src && yarn link $package
  done
}

alias idev="yank @nudj/framework @nudj/components @nudj/api @nudj/library && dev"
alias ll="ls -la"
alias d="docker"
alias dm="docker-machine"
alias ds="docker-swarm"
alias dco="docker-compose"

# changes hex 0x15 to delete everything to the left of the cursor,
# rather than the whole line
bindkey "^U" backward-kill-line

# binds hex 0x18 0x7f with deleting everything to the left of the cursor
bindkey "^X\\x7f" backward-kill-line

# adds redo
bindkey "^X^_" redo

# history substring search
zle -N history-substring-search-up
zle -N history-substring-search-down
bindkey "^[OA" history-substring-search-up
bindkey "^[OB" history-substring-search-down

source /root/.zsh/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
source /root/.zsh/zsh-history-substring-search/zsh-history-substring-search.zsh
